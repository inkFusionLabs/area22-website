document.addEventListener('DOMContentLoaded', function() {
	console.log('🎵 Music Request Form loaded');

	function checkSupabase() {
		if (typeof window.supabase === 'undefined') {
			console.log('Supabase not loaded yet, waiting...');
			setTimeout(checkSupabase, 500);
			return;
		}

		console.log('✅ Supabase client available');
		console.log('Supabase URL:', typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL : '(unknown)');
		initializeForm();
	}

	async function checkRequestLimit() {
		try {
			console.log('🔍 Checking current request count...');
			const { count, error } = await supabase
				.from('song_requests')
				.select('*', { count: 'exact', head: true });

			if (error) {
				console.error('Error checking request count:', error);
				return { count: 0, error };
			}

			console.log(`📊 Current request count: ${count}`);
			return { count: count || 0, error: null };
		} catch (error) {
			console.error('Error in checkRequestLimit:', error);
			return { count: 0, error };
		}
	}

	async function initializeForm() {
		const form = document.getElementById('musicRequestForm');
		const submitBtn = document.getElementById('submitBtn');
		const btnText = document.getElementById('btnText');
		const message = document.getElementById('message');

		// Check request limit first
		const { count, error } = await checkRequestLimit();
		const MAX_REQUESTS = 60;

		if (error) {
			console.error('Failed to check request limit:', error);
			showMessage('Unable to check request availability. Please try again later.', 'error');
			return;
		}

		if (count >= MAX_REQUESTS) {
			console.log(`🚫 Request limit reached: ${count}/${MAX_REQUESTS}`);
			showRequestLimitReached(count, MAX_REQUESTS);
			disableForm();
			return;
		}

		// Show remaining requests
		const remaining = MAX_REQUESTS - count;
		showRequestStatus(count, MAX_REQUESTS, remaining);

		console.log('✅ Form initialized, ready for submissions');
		submitBtn.addEventListener('click', function() {
			console.log('🔘 Submit button clicked');
		});

		form.addEventListener('submit', async function(e) {
			console.log('📤 Form submission triggered');
			e.preventDefault();

			// Double-check limit before submission
			const { count } = await checkRequestLimit();
			if (count >= MAX_REQUESTS) {
				showRequestLimitReached(count, MAX_REQUESTS);
				disableForm();
				return;
			}

			const formData = new FormData(form);
			const requestData = {
				song_title: (formData.get('songTitle') || '').trim(),
				artist_name: (formData.get('artistName') || '').trim(),
				guest_name: (formData.get('guestName') || '').trim() || 'Anonymous',
				note: (formData.get('note') || '').trim(),
				priority: formData.get('priority') || 'normal',
				status: 'pending',
				event_code: 'default'
			};

			console.log('📝 Form data collected:', requestData);

			if (!requestData.song_title || !requestData.artist_name) {
				showMessage('Please fill in the required fields (Song Title and Artist).', 'error');
				return;
			}

			submitBtn.disabled = true;
			btnText.innerHTML = '<span class="loading"></span>Submitting...';

			try {
				console.log('Testing Supabase connection...');
				const { error: testError } = await supabase
					.from('song_requests')
					.select('count', { count: 'exact', head: true });

				if (testError) {
					console.error('Connection test failed:', testError);
					throw new Error('Connection test failed: ' + testError.message);
				}

				console.log('Supabase connection OK, proceeding with submission...');
				console.log('🚀 Attempting to submit to Supabase...');
				const { data, error } = await supabase
					.from('song_requests')
					.insert([requestData])
					.select();

				console.log('📡 Supabase response received:', { data, error });
				if (error) throw error;

				// Update count after successful submission
				const newCount = count + 1;
				const newRemaining = MAX_REQUESTS - newCount;
				
				if (newRemaining <= 0) {
					showMessage('🎵 Your song request has been submitted successfully! This was the final request - the limit has been reached.', 'success');
					disableForm();
				} else {
					showMessage(`🎵 Your song request has been submitted successfully! ${newRemaining} requests remaining.`, 'success');
					showRequestStatus(newCount, MAX_REQUESTS, newRemaining);
				}
				
				form.reset();
			} catch (error) {
				console.error('Error submitting request:', error);
				console.error('Error details:', { message: error.message, name: error.name });
				let errorMessage = 'Sorry, there was an error submitting your request. Please try again.';
				if (error.message && error.message.includes('CORS')) errorMessage = 'Network error - please check your connection and try again.';
				else if (error.message && error.message.includes('fetch')) errorMessage = 'Connection error - please check your internet connection.';
				else if (error.message && (error.message.includes('permission') || error.message.includes('policy'))) errorMessage = 'Permission error - please contact support.';
				showMessage(errorMessage, 'error');
			} finally {
				submitBtn.disabled = false;
				btnText.textContent = 'Submit Request';
			}
		});

		function showMessage(text, type) {
			message.textContent = text;
			message.className = `message ${type}`;
			message.style.display = 'block';
			if (type === 'success') {
				setTimeout(() => { message.style.display = 'none'; }, 5000);
			}
		}

		function showRequestStatus(current, max, remaining) {
			const statusDiv = document.getElementById('requestStatus') || createStatusDiv();
			statusDiv.innerHTML = `
				<div style="background: #e8f5e8; border: 2px solid #00ff00; border-radius: 10px; padding: 15px; margin-bottom: 20px; text-align: center;">
					<div style="font-weight: 600; color: #333; margin-bottom: 5px;">📊 Request Status</div>
					<div style="color: #666; font-size: 14px;">
						${current}/${max} requests submitted • <strong style="color: #00aa00;">${remaining} remaining</strong>
					</div>
					<div style="background: #f0f0f0; border-radius: 5px; height: 8px; margin-top: 10px; overflow: hidden;">
						<div style="background: linear-gradient(90deg, #00ff00, #00cc00); height: 100%; width: ${(current/max)*100}%; transition: width 0.3s ease;"></div>
					</div>
				</div>
			`;
		}

		function showRequestLimitReached(current, max) {
			const statusDiv = document.getElementById('requestStatus') || createStatusDiv();
			statusDiv.innerHTML = `
				<div style="background: #ffe8e8; border: 2px solid #ff4444; border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: center;">
					<div style="font-size: 24px; margin-bottom: 10px;">🚫</div>
					<div style="font-weight: 600; color: #333; margin-bottom: 10px; font-size: 18px;">Request Limit Reached</div>
					<div style="color: #666; margin-bottom: 15px;">
						We've reached our maximum of ${max} song requests for this event.
					</div>
					<div style="color: #888; font-size: 14px;">
						Thank you for your interest! You can still contact us directly for special requests.
					</div>
				</div>
			`;
		}

		function createStatusDiv() {
			const statusDiv = document.createElement('div');
			statusDiv.id = 'requestStatus';
			const header = document.querySelector('.header');
			header.parentNode.insertBefore(statusDiv, header.nextSibling);
			return statusDiv;
		}

		function disableForm() {
			const form = document.getElementById('musicRequestForm');
			const submitBtn = document.getElementById('submitBtn');
			const inputs = form.querySelectorAll('input, textarea, select');
			
			inputs.forEach(input => {
				input.disabled = true;
				input.style.opacity = '0.6';
			});
			
			submitBtn.disabled = true;
			submitBtn.style.opacity = '0.6';
			submitBtn.textContent = 'Requests Closed';
		}

		// Expose manual test helper
		window.testSupabaseSubmit = async function() {
			console.log('🧪 Manual test submission...');
			const testData = {
				song_title: 'Test Song ' + Date.now(),
				artist_name: 'Test Artist',
				guest_name: 'Test Guest',
				note: 'Manual test',
				priority: 'normal',
				status: 'pending',
				event_code: 'default'
			};
			try {
				const { data, error } = await supabase
					.from('song_requests')
					.insert([testData])
					.select();
				console.log('🧪 Manual test result:', { data, error });
				return { data, error };
			} catch (err) {
				console.error('🧪 Manual test error:', err);
				return { error: err };
			}
		};
	}

	checkSupabase();
});
