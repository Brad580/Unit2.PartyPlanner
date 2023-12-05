document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('eventForm');
    const partyContainer = document.getElementById('partyContainer');

    const getParties = async () => {
        try {
            const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events');
            const { data: parties } = await response.json();
            displayParties(parties);
        } catch (error) {
            console.error('Error fetching parties:', error);
        }
    };

    const displayParties = (parties) => {
        partyContainer.innerHTML = '';
        parties.forEach((party) => {
            const partyItem = createPartyItem(party);
            partyContainer.appendChild(partyItem);
        });
    };

    const createPartyItem = (party) => {
        const partyItem = document.createElement('div');

        if (party) {
            partyItem.innerHTML = `
                <p><strong>${party.name}</strong></p>
                <p>Date: ${new Date(party.date).toLocaleDateString()}</p>
                <p>Location: ${party.location}</p>
                <p>Description: ${party.description}</p>
                <button data-id="${party.id}" class="deleteButton">Delete</button>
            `;

            const deleteButton = partyItem.querySelector('.deleteButton');
            deleteButton.addEventListener('click', () => deleteParty(party.id));
        } else {
            console.error('Invalid party data:', party);
        }

        return partyItem;
    };

    const deleteParty = async (partyId) => {
        try {
            await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events/${partyId}`, {
                method: 'DELETE',
            });
            getParties();
        } catch (error) {
            console.error('Error deleting party:', error);
        }
    };

    eventForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(eventForm);
        const partyData = {
            name: formData.get('name'),
            date: new Date(formData.get('date')).toISOString(), // Convert to ISO-8601 DateTime
            location: formData.get('location'),
            description: formData.get('description'),
        };

        try {
            const response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partyData),
            });

            if (!response.ok) {
                const responseBody = await response.json();
                console.error('Server response:', responseBody);

                if (responseBody.error && responseBody.error.message) {
                    console.error('Server error message:', responseBody.error.message);
                }

                throw new Error('Failed to add party');
            }

            const { data: newParty } = await response.json();
            addPartyToList(newParty);
        } catch (error) {
            console.error('Error adding party:', error);
        }

        eventForm.reset();
    });

    const addPartyToList = (party) => {
        const partyItem = createPartyItem(party);
        partyContainer.appendChild(partyItem);
    };

    getParties();
});


