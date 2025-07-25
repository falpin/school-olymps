function getOlymp() {
    const result = null
    const jwtToken = getCookie('jwt_token');
    const host = "https://olympiad-api.falpin.ru" 
    fetch(`${host}/olympiads`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(errorText);
            });
        }
        return response.json();
    })
    .then(result => {
        if (document.getElementById("olympiads-container")) {createOlympCards(result);}
        if (document.getElementById("admin-olymps-container")) {createAdminOlympCards(result);}
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function startTest(olympiadId) {
    const jwtToken = getCookie('jwt_token');
    const host = "https://olympiad-api.falpin.ru";
    return fetch(`${host}/olympiads/${olympiadId}/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                console.log("Error text:", errorText);
                throw new Error(errorText);
            });
        }
        return response.json();
    });
}

function createOlympCards(olympiads) {
    const container = document.getElementById('olympiads-container');
    
    olympiads.forEach(olympiad => {
        const card = document.createElement('div');
        card.className = 'olympiad';
        
        card.innerHTML = `
            <div class="row">
            <h3 class="h3 normal">${olympiad.title}</h3>
                    <div class="heart-section heart-list-item">
            <svg class="animated-path empty-heart" width="30px" height="30px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" 
            xmlns="http://www.w3.org/2000/svg" color="currentColor">
            <path d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z" stroke="#795548" stroke-width="2.5" stroke-linejoin="round"></path>
        </svg>
        <svg class="animated-path filled-heart" style="display: none;" width="30px" height="30px" viewBox="0 0 24 24" fill="none" 
        xmlns="http://www.w3.org/2000/svg">

        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="rgba(255, 194, 103, 0.32)" stroke="#D95707" stroke-width="2.5"></path>
    </svg>
    <span class="saved-text" style="display: none;">В избранном</span>
</div>
            </div>
            <h5 class=" h5 normal">${olympiad.description}</h5>
            <h4 class="h4 normal">
                с <span>${olympiad.start_time}</span>
                до <span>${olympiad.end_time}</span>
            </h4>
            <a class="h5 test-link" href="#" data-olymp-id="${olympiad.id}">Выполнить олимпиаду</a>
        `;
        console.log('Вставляем')
        container.appendChild(card);
    });


    // Добавляем обработчики событий для всех ссылок на тесты
    document.querySelectorAll('.test-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const olympiadId = this.getAttribute('data-olymp-id');
            
            startTest(olympiadId)
                .then(() => {
                    // После успешного начала теста перенаправляем на страницу теста
                    window.location.href = `/online-olympiad/${olympiadId}`;
                })
                .catch(error => {
                    console.error('Ошибка при начале олимпиады:', olympiadId);
                    console.log(error)
                    showNotification('Вы не можете выполнить эту олимпиаду');
                });
        });
    });
}

function createAdminOlympCards(tests){
    const container = document.getElementById('admin-olymps-container');
    
    tests.forEach(test => {
        const card = document.createElement('div');
        card.className = 'lib-card';
        
        card.innerHTML = `
            <div>
                <h4 class="h4 bold">${test.title}</h4>
            </div>
            <div>
                <h4 class="h4 normal">${test.description}</h4>
            </div>
            <div class="row">
            <a class="generate-btn approve-btn"><h4>Изменить</h4></a>
            <button class="generate-btn approve-btn"><h4>Удалить</h4></button>
            </div>
            
        `;
        
        container.appendChild(card);
    });
}

getOlymp();