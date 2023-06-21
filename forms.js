import { openModal, closeModal } from "./modal";

function forms(modalTimerId) {
    const forms = document.querySelectorAll("form");

    forms.forEach((item) => {
      bindPostData(item);
    })
  
    const postData = async (url, data) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      });
      
      return await res.json();
    }
    
    function bindPostData(form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const message = {
          loading: "img/form/spinner.svg",
          success: "Ваш запрос успешно отправлен, с Вами скоро свяжутся!",
          fail: "Что-то пошло не так..."
        }
  
        const statusMessage = document.createElement("img");
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
        `;
        form.insertAdjacentElement("afterend", statusMessage);
  
        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData.entries()));
        
        postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showGreetingMessage(message.success);
          statusMessage.remove();
        })
        .finally(() => {
          form.reset();
        })
        .catch((error) => {
          console.warn("Oops, something happened..." + error);
          showGreetingMessage(message.fail);
        })
      });
    }

    function showGreetingMessage(requestMessage) {
        const modalDialog = document.querySelector(".modal__dialog");
        modalDialog.classList.add("hide");
    
        openModal('.modal', modalTimerId);
    
        const modalGreeting = document.createElement("div");
        modalGreeting.classList.add("modal__dialog");
        modalGreeting.innerHTML = `
          <div class="modal__content">
            <div data-close="" class="modal__close">×</div>
            <div class="modal__title">${requestMessage}</div>
          </div>
        `;
        document.querySelector(".modal").append(modalGreeting);
       
        setTimeout(() => {
          modalGreeting.remove();
          modalDialog.classList.add("show");
          modalDialog.classList.remove("hide");
          closeModal('.modal');
        }, 4000);
    }
}

export default forms;