document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waitlist-form');
  const signupCard = document.getElementById('signup-card');
  const successCard = document.getElementById('success-card');
  
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const emailInput = document.getElementById('email');
  const countryInput = document.getElementById('country');
  
  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayEmail = document.getElementById('user-display-email');
  
  const resetFormBtn = document.getElementById('reset-form-btn');
  const copyLinkBtn = document.getElementById('copy-link');
  const shareTwitterBtn = document.getElementById('share-twitter');

  // --- Accessibility & Validation Bridges ---

  // Sync aria-invalid based on validity check
  const syncAriaInvalid = (input) => {
    if (!input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  // Sync state on blur (when user finishes interacting)
  form.addEventListener('blur', (e) => {
    if (e.target.matches('input, select')) {
      syncAriaInvalid(e.target);
    }
  }, true); // Use capture phase because blur does not bubble

  // Clear invalid indicators instantly upon user typing/correcting
  form.addEventListener('input', (e) => {
    if (e.target.matches('input, select') && e.target.checkValidity()) {
      e.target.removeAttribute('aria-invalid');
    }
  });

  // Specifically watch dropdown change for accessibility syncing
  countryInput.addEventListener('change', () => {
    if (countryInput.checkValidity()) {
      countryInput.removeAttribute('aria-invalid');
    }
  });

  // --- Form Submission ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check validity of all fields
    const inputs = form.querySelectorAll('input, select');
    let isFormValid = true;

    inputs.forEach((input) => {
      syncAriaInvalid(input);
      if (!input.checkValidity()) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Simulate API registration request and success
      const firstName = firstNameInput.value.trim();
      const email = emailInput.value.trim();

      // Show success screen with custom details
      userDisplayName.textContent = firstName;
      userDisplayEmail.textContent = email;

      // Transition animation
      signupCard.classList.add('hidden');
      successCard.classList.remove('hidden');
      
      // Scroll to top of the card smoothly if on mobile
      successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // Focus on the first invalid field
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // --- Reset/Back Button ---
  resetFormBtn.addEventListener('click', () => {
    form.reset();
    
    // Clear validation states
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach((input) => {
      input.removeAttribute('aria-invalid');
    });

    successCard.classList.add('hidden');
    signupCard.classList.remove('hidden');
  });

  // --- Share Interaction ---
  shareTwitterBtn.addEventListener('click', () => {
    const text = encodeURIComponent("I just joined the waitlist for Antigravity Workspace! Defy friction and automate everything. Join here: ");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  });

  // --- Copy Invite Link ---
  copyLinkBtn.addEventListener('click', async () => {
    const inviteLink = `${window.location.origin}/?ref=${Math.random().toString(36).substring(2, 8)}`;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      const originalText = copyLinkBtn.textContent;
      copyLinkBtn.textContent = 'Copied! ✓';
      copyLinkBtn.style.borderColor = 'var(--color-success)';
      copyLinkBtn.style.color = 'var(--color-success)';
      
      setTimeout(() => {
        copyLinkBtn.textContent = originalText;
        copyLinkBtn.style.borderColor = '';
        copyLinkBtn.style.color = '';
      }, 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback
      alert(`Your invite link: ${inviteLink}`);
    }
  });
});
