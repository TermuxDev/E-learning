document.addEventListener('DOMContentLoaded', () => {
    const multiStepForm = document.getElementById('multistep-form');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const nextBtn = document.getElementById('next-btn');

    const lockOverlay = document.getElementById('lock-overlay');
    const formsContainer = document.querySelector('.forms-container');
    const countdownTitle = document.getElementById('countdown-title');
    const countdownTimer = document.querySelector('.countdown-timer');

    
    function getSunday16h30() {
        const now = new Date();
        const dayOfWeek = now.getDay(); 
        const daysUntilSunday = (7 - dayOfWeek) % 7;
        const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 16, 30, 0);

        if (dayOfWeek === 0 && (now.getHours() > 16 || (now.getHours() === 16 && now.getMinutes() >= 30))) {
            sunday.setDate(sunday.getDate() + 7); 
        }
        return sunday;
    }

    const endDate = getSunday16h30().getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;

        const jours = Math.floor(distance / (1000 * 60 * 60 * 24));
        const heures = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secondes = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(countdownInterval);
            formsContainer.classList.add('hidden');
            countdownTitle.textContent = "La plateforme est verouillée.";
            countdownTimer.classList.add('hidden');
            lockOverlay.classList.remove('hidden');
        } else {
            document.getElementById('jours').textContent = jours;
            document.getElementById('heures').textContent = heures;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('secondes').textContent = secondes;
        }
    }, 1000);

    
    nextBtn.addEventListener('click', () => {
        
        const requiredInputs = step1.querySelectorAll('[required]');
        let allValid = true;
        requiredInputs.forEach(input => {
            if (!input.checkValidity()) {
                allValid = false;
                input.reportValidity();
            }
        });

        if (allValid) {
           
            step1.classList.add('fade-out');
            setTimeout(() => {
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
                step2.classList.add('fade-in');
            }, 500); // Durée de l'animation
        }
    });

    
    multiStepForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        
        const formData = new FormData(multiStepForm);

        try {
            const response = await fetch(multiStepForm.action, {
                method: multiStepForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert("Votre candidature a été envoyée avec succès !");
                multiStepForm.reset();
             
                step2.classList.add('hidden');
                step1.classList.remove('hidden');
            } else {
                alert("Une erreur s'est produite lors de la soumission. Veuillez réessayer.");
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Une erreur de connexion s'est produite. Veuillez vérifier votre réseau.");
        }
    });
});