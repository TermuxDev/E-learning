document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const projectForm = document.getElementById('project-form');
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
            // Verrouillage de la plateforme
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

    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert("Votre soumission a été envoyée avec succès !");
                form.reset();
            } else {
                alert("Une erreur est survenue. Veuillez réessayer.");
            }
        } catch (error) {
            alert("Une erreur de connexion est survenue. Vérifiez votre réseau.");
        }
    };

    registrationForm.addEventListener('submit', handleFormSubmit);
    projectForm.addEventListener('submit', handleFormSubmit);

});