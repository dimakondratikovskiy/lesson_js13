class User {
    constructor(name, email, address, phone) {
        this.data = {
            name: name,
            email: email,
            address: address,
            phone: phone        
        };
    }

    get() {
        return this.data;
    }
}

class Contacts {
    constructor() {
        this.arrContacts = JSON.parse(localStorage.getItem('contactsData')) || [];
    }

    set storage({name, email, address, phone}) {
        const user = new User(name, email, address, phone);
        const userGet = user.get()
        this.arrContacts.push({id: this.arrContacts.length, ...userGet});
        localStorage.setItem('contactsData', JSON.stringify(this.arrContacts));

        document.cookie = "storageExpiration=Contacts_" + this.arrContacts.length + "; max-age=" + (60 * 60 * 24 * 10);
    }

    edit(id, name, email, address, phone) {
        this.arrContacts[id].name = name;
        this.arrContacts[id].email = email;
        this.arrContacts[id].address = address;
        this.arrContacts[id].phone = phone;
    }

    remove(id) {
        delete this.arrContacts[id];
    }

    get storage() {
        return JSON.parse(localStorage.getItem('contactsData'));
    }
}

class ContactsApp extends Contacts {
    constructor() {
        super();

        this.app = document.createElement('div');
        this.create();
    }

    create() {
        const self = this;

        document.body.appendChild(this.app);
        this.app.classList.add('contacts');

        this.app.insertAdjacentHTML('beforeend',
        `<div class="container">
            <h1>Список контактов</h1>
            <div class="input">
                <input type="text" class="name" placeholder="Имя">
                <input type="text" class="email" placeholder="Email">
                <input type="text" class="address" placeholder="Адрес">
                <input type="text" class="phone" placeholder="Телефон">
            </div>
            <ul class="list"></ul>
            <div class="button">
                <button class="add">Добавить</button>
                <button class="reset">Очистить</button>
            </div>
        </div>`);

        const btnAdd = document.querySelector('.add');
        btnAdd.addEventListener('click', () => {
            let name = document.getElementsByTagName("input")[0],
                email = document.getElementsByTagName("input")[1],
                address = document.getElementsByTagName("input")[2],
                phone = document.getElementsByTagName("input")[3];     

            self.storage = {name: name.value, email: email.value, address: address.value, phone: phone.value};

            if (document.querySelectorAll('li')) {
                document.querySelectorAll('li').forEach(element => element.remove());
            }
                    
            this.createContacts();

            name.value = email.value = address.value = phone.value = '';
        });

        const btnReset = document.querySelector('.reset');
        btnReset.addEventListener('click', () => {
            document.querySelectorAll('li').forEach(element => element.remove());
            this.arrContacts.splice(0, this.arrContacts.length);
            window.localStorage.clear('contactsData');
        });

        if (this.arrContacts.length > 0) {
            this.createContacts();
        }
    }

    createContacts() {
        const self = this;
        const localContacts = localStorage.getItem('contactsData'),
            dataContacts  = JSON.parse(localContacts);
        
        dataContacts.map(user => {
            if (user == null) {
                return;
            }

            const pencil = document.createElement('i');
            pencil.classList.add('fa');
            pencil.classList.add('fa-pencil');

            const trash = document.createElement('i');
            trash.classList.add('fa');
            trash.classList.add('fa-trash-o');

            const span = document.createElement('span');
            span.append(pencil, trash);

            const li = document.createElement('li');

            const p = document.createElement('p');
            p.innerHTML = 'Имя: ' + user.name + '<br> Email: ' + user.email + '<br> Адрес: ' + user.address + '<br> Телефон: ' + user.phone;
            li.append(p, span);
            document.querySelector('ul').append(li);

            trash.addEventListener('click', () => {
				self.remove(user.id);
                li.remove();

                function removeContacts(id){
                    let result = JSON.parse(localStorage.getItem('contactsData'));
                    delete result[id];
                    localStorage.setItem('contactsData', JSON.stringify(result));
                }
                
                removeContacts(user.id);
            });
            
            pencil.addEventListener('click', () => {
				user.name = prompt('Редактировать имя:', user.name);
                user.email = prompt('Редактировать email:', user.email);
                user.address = prompt('Редактировать адрес:', user.address);
                user.phone = prompt('Редактировать телефон:', user.phone);

                self.edit(user.id, user.name, user.email, user.address, user.phone);

                p.innerHTML = 'Имя: ' + user.name + '<br> Email: ' + user.email + '<br> Адрес: ' + user.address + '<br> Телефон: ' + user.phone;
                li.append(p, span);

                function editContacts(id, name, email, address, phone){
                    let result = JSON.parse(localStorage.getItem('contactsData'));
                    result[id] = {id: id, name: name, email: email, address: address, phone: phone};
                    localStorage.setItem('contactsData', JSON.stringify(result));
                }
                editContacts(user.id, user.name, user.email, user.address, user.phone);
			});
        });
        
        setTimeout(() => {
            localStorage.clear();
        }, 8.64e+8);
    }
}

let contactsApp = new ContactsApp();