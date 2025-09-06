document.addEventListener('DOMContentLoaded', function() {
	console.log('🎵 Music Request Form loaded');

	// --- Global Manual Lock System (runs immediately, independent of Supabase) ---
	const LOCK_KEY = 'area22_song_requests_locked';
	let inMemoryLock = false; // fallback for private mode

	function setLocked(isLocked) {
		try { localStorage.setItem(LOCK_KEY, isLocked ? 'true' : 'false'); }
		catch(e) { inMemoryLock = isLocked; }
	}
	function isLocked() {
		try { return localStorage.getItem(LOCK_KEY) === 'true'; }
		catch(e) { return inMemoryLock; }
	}
	function applyLockFromURL() {
		try {
			const params = new URLSearchParams(window.location.search);
			const lockParam = params.get('lock');
			if (lockParam === 'on') { setLocked(true); console.log('🔒 Requests locked via URL parameter'); }
			else if (lockParam === 'off') { setLocked(false); console.log('🔓 Requests unlocked via URL parameter'); }
		} catch (e) { console.warn('Failed to parse URL params for lock toggle:', e); }
	}
	function disableForm() {
		const form = document.getElementById('musicRequestForm');
		const submitBtn = document.getElementById('submitBtn');
		const btnText = document.getElementById('btnText');
		if (!form || !submitBtn || !btnText) return;
		const inputs = form.querySelectorAll('input, textarea, select');
		inputs.forEach(input => { input.disabled = true; input.style.opacity = '0.6'; });
		submitBtn.disabled = true;
		submitBtn.style.opacity = '0.6';
		btnText.textContent = 'Requests Locked';
	}
	function enableForm() {
		const form = document.getElementById('musicRequestForm');
		const submitBtn = document.getElementById('submitBtn');
		const btnText = document.getElementById('btnText');
		if (!form || !submitBtn || !btnText) return;
		const inputs = form.querySelectorAll('input, textarea, select');
		inputs.forEach(input => { input.disabled = false; input.style.opacity = ''; });
		submitBtn.disabled = false;
		submitBtn.style.opacity = '';
		btnText.textContent = 'Submit Request';
	}
	function showLockMessage() {
		const message = document.getElementById('message');
		if (!message) return;
		message.textContent = 'Requests are currently locked. Please check back later.';
		message.className = 'message error';
		message.style.display = 'block';
	}
	function clearMessage() {
		const message = document.getElementById('message');
		if (!message) return;
		message.textContent = '';
		message.className = 'message';
		message.style.display = 'none';
	}
	function applyLockUI() {
		if (isLocked()) { disableForm(); showLockMessage(); }
		else { enableForm(); clearMessage(); }
	}
	// Apply lock state ASAP and on mobile page restore
	applyLockFromURL();
	applyLockUI();
	window.addEventListener('pageshow', applyLockUI); // iOS/Safari BFCache
	document.addEventListener('visibilitychange', function(){ if (!document.hidden) applyLockUI(); });
	// --- End Global Manual Lock System ---

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

		// Make sure lock UI reflects current state (in case elements just became available)
		applyLockUI();

		console.log('✅ Form initialized, ready for submissions');
		submitBtn.addEventListener('click', function() {
			console.log('🔘 Submit button clicked');
		});

		form.addEventListener('submit', async function(e) {
			console.log('📤 Form submission triggered');
			e.preventDefault();

			// Block submission if locked
			if (isLocked()) { showLockMessage(); return; }

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
			if (type === 'success') { setTimeout(() => { message.style.display = 'none'; }, 5000); }
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
