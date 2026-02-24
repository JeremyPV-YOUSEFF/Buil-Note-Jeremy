/* Change mode dark to light */
document.getElementById('mode').addEventListener('change',(e) => {
    document.querySelector('html').setAttribute(
        'data-theme',
        e.target.checked ? 'dark' : 'light'
    )
})


/* const notes  = []; */

/* Input text */
const inputText = document.getElementById('text');
inputText.addEventListener('keydown',(e) => {
    if (inputText.value.trim() == "") return;        
    if (inputText.value.length >0 && e.key === 'Enter') {
        const notesLocal = JSON.parse(localStorage.getItem('notes')) ?? [];
        notesLocal.push({id:crypto.randomUUID(),text:inputText.value,isCompleted:false});
        inputText.value = "";
        localStorage.setItem('notes',JSON.stringify(notesLocal))
        this.listNotes();
        showMessage('Note addes successfully')
        setTimeout(() => {
            hiddenMessage();
        }, 1000);
    }else{
        /* Message of error */
        /* showErrorText();
        setTimeout(() => {
            hiddenErrorText();
        }, 1000); */
    }
})

/* List of notes */
function listNotes(type){
    const list = document.getElementById('list')

    /* Removing the notes to reload again and avoid duplicates notes*/
    const reloadNotes = list.querySelectorAll('.note-item');
    reloadNotes.forEach(x => x.remove());

    const noteLocal = JSON.parse(localStorage.getItem('notes'));

    if (noteLocal !== null && noteLocal.length>0) {

        let exits = document.getElementById('messageNoneNotes')
        if (exits) {
            exits.remove();
        };       

        /* Show notes */
        let i = 0;
        noteLocal.forEach((element) => {
            switch (type) {
            case 'active':
                if (element.isCompleted == false) {
                    renderNotes(element,list)
                    i++;
                }
                break;
            case 'completed':
                if (element.isCompleted == true) {
                    renderNotes(element,list)
                    i++;    
                }
                break;
            default:
                renderNotes(element,list)
                i++;
                document.querySelector(`input[name="option"][value="all"]`).checked = true;
                document.querySelector(`input[name="option-mobile"][value="all"]`).checked = true;
                break;
        }
        });

        document.getElementById('numberNotes').textContent = i + ' items left';
        document.getElementById('options').classList.remove('hidden');
        document.getElementById('types').classList.remove('hidden');
        
    }else{
        document.getElementById('options').classList.add('hidden');
        document.getElementById('types').classList.add('hidden');
        
        /* Check if exits the message of no notes */
        let exits = document.getElementById('messageNoneNotes')
        if (exits) return;            
        const li = document.createElement('li');
        li.id = 'messageNoneNotes';
        li.textContent = "There is no note";
        li.classList.add('bg-gray-50','text-navy-850','rounded-lg','px-4','py-2','text-center','dark:bg-navy-900','dark:text-purple-300','shadow-xl')
        list.appendChild(li);
    }
}

listNotes();

function renderNotes(element,list){
    let li = document.createElement('li');

    let label = document.createElement('label');
    let span1 = document.createElement('span');

    let input = document.createElement('input');
    let div = document.createElement('div');
    let p = document.createElement('p');

    let span2 = document.createElement('span');

    li.className = `border-b-2 border-gray-300 px-4 py-3 flex items-center note-item space-x-4`;
    li.classList.add('note-item');
    label.className = `relative flex space-x-2 items-center size-6`;
    span1.className = `inline-block bg-(image:--image-x) size-4 cursor-pointer bg-cover bg-center`;

    span1.dataset.index = element.id;

    span1.addEventListener('click',(e) => {
        const id = e.target.dataset.index;
        deleteNote(id);
    })

    input.className = `hidden peer w-4`;
    input.type = 'checkbox';
    input.dataset.index = element.id;

    input.addEventListener('click',(e) => {
        const id = e.target.dataset.index; 
        updateNote(id); 
    })

    div.className = element.isCompleted 
    ? 'peer-checked:[&>span]:opacity-100 cursor-pointer relative size-6 rounded-full border-0 border-gray-300 bg-linear-to-r from-blue to-purple ' 
    : 'peer-checked:[&>span]:opacity-100 cursor-pointer relative size-6 rounded-full border-2 border-gray-300';

    span2.className = element.isCompleted 
    ? `size-3 bg-(image:--image-check) bg-cover bg-center absolute transform top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-100`
    : `size-3 bg-(image:--image-check) bg-cover bg-center absolute transform top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0`

    p.className = element.isCompleted
    ? 'text-gray-300 font-medium text-sm min-w-0 dark:text-navy-850 flex-1 wrap-break-word line-through'
    : 'text-navy-850 font-medium text-sm min-w-0 dark:text-gray-300 flex-1 wrap-break-word'
    
    p.textContent = element.text;

    div.appendChild(span2);

    label.appendChild(input);
    label.appendChild(div);
    
    li.appendChild(label);
    li.appendChild(p);
    li.appendChild(span1);

    list.append(li);
}


/* Delete all notes */
document.getElementById('clearAll').addEventListener('click',(x) => {
    localStorage.removeItem('notes');
    listNotes();
})

/* Delete a note */

let idNote;
async function deleteNote(id){
    changeBackground();
    idNote = id;
}

document.getElementById('accept').addEventListener('click',() => {
    if (idNote) {
        let noteLocal = JSON.parse(localStorage.getItem('notes'));
        noteLocal = noteLocal.filter(x => x.id != idNote );
        localStorage.setItem('notes',JSON.stringify(noteLocal));
        listNotes();
        idNote = null;
        resetBackground();
        showMessage("Note deleted successfully")
        setTimeout(() => {
            hiddenMessage();
        }, 1000);
    }
})

/* Change state of a note */
let idChange;
function updateNote(id){
    idChange = id;
    change();
}

document.getElementById('acceptChange').addEventListener('click',() => {
    if (idChange) {
        let noteLocal = JSON.parse(localStorage.getItem('notes'));
        noteLocal.forEach(element => {
            if (element.id == idChange) {
                element.isCompleted = !element.isCompleted;
            }
        }); 
        localStorage.setItem('notes',JSON.stringify(noteLocal));
        listNotes();

        idChange = null;
        changeClose();

        showMessage("State changed successfully")
        setTimeout(() => {
            hiddenMessage();
        }, 1000);
    }
})


/* Change type of notes */
function changeType(type){
    if (type == 'active') {
        listNotes(type);
    }else if (type == 'completed'){
        listNotes(type);
    }else{
        listNotes();
    }
}

/* Change background */
function changeBackground(){
    document.getElementById('main').classList.add('opacity-15');
    document.getElementById('dialogContinue').classList.remove('hidden');
}

/* Reset background */
function resetBackground(){
    document.getElementById('main').classList.remove('opacity-15');
    document.getElementById('dialogContinue').classList.add('hidden');
}

/* Close popup - delete */
document.getElementById('close').addEventListener('click',() =>{
    resetBackground();
})

/* Change */
function change(){
    document.getElementById('main').classList.add('opacity-15');
    document.getElementById('dialogChange').classList.remove('hidden');
}

/* Change-close Function */
function changeClose(){
    document.getElementById('main').classList.remove('opacity-15');
    document.getElementById('dialogChange').classList.add('hidden');
}

/* close-change */
document.getElementById('closeChange').addEventListener('click',() =>{
    changeClose();
})



/* Show message */
function showMessage(text){
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.remove('hidden');
}

/* Hidden message */
function hiddenMessage(){
    const message = document.getElementById('message');
        message.textContent = "";
        message.classList.add('hidden');
}

/* error-text-show */
function showErrorText(){
    const message = document.getElementById('errorText');
    message.classList.remove('hidden');
}

/* error-text-hiddel */
function hiddenErrorText(){
    const message = document.getElementById('errorText');
    message.classList.add('hidden');
}
