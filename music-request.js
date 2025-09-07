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

	function initializeForm() {
		const form = document.getElementById('musicRequestForm');
		const submitBtn = document.getElementById('submitBtn');
		const btnText = document.getElementById('btnText');
		const message = document.getElementById('message');

		console.log('✅ Form initialized, ready for submissions');
		submitBtn.addEventListener('click', function() {
			console.log('🔘 Submit button clicked');
		});

		form.addEventListener('submit', async function(e) {
			console.log('📤 Form submission triggered');
			e.preventDefault();

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

				showMessage('🎵 Your song request has been submitted successfully!', 'success');
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
