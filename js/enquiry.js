(() => {
  'use strict';
  document.querySelectorAll('input[name="phone"]').forEach(input => {
    input.inputMode='tel';
    const format=()=>{
      let digits=input.value.replace(/\D/g,'');
      if(digits.startsWith('7')||digits.startsWith('8'))digits=digits.slice(1);
      digits=digits.slice(0,10);
      input.value='+7'+(digits?' ('+digits.slice(0,3)+(digits.length>=3?') ':'')+digits.slice(3,6)+(digits.length>6?'-'+digits.slice(6,8):'')+(digits.length>8?'-'+digits.slice(8,10):''):' ');
      input.setCustomValidity('');
    };
    input.addEventListener('focus',()=>{if(!input.value)input.value='+7 ';});
    input.addEventListener('input',format);
    input.addEventListener('blur',()=>{if(input.value.replace(/\D/g,'')==='7')input.value='';});
  });
  window.EtalonEnquiry={
    phone(form){const value=form.elements.phone.value.trim();return value.replace(/\D/g,'').length<=1?'':value;},
    async send(form,subject,message,status){
      if(form.dataset.sending)return;
      const button=form.querySelector('[type="submit"]');
      form.dataset.sending='true';button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Отправляем заявку…';
      try{
        const response=await fetch('https://formsubmit.co/ajax/nastilvl@yandex.ru',{
          method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify({name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),phone:this.phone(form),message,_subject:subject,_template:'table',_honey:form.elements.website?.value||''}),
          signal:AbortSignal.timeout(20000)
        });
        const result=await response.json();
        if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Not accepted');
        status.textContent='Заявка принята почтовым сервисом. Спасибо за обращение!';
      }catch(error){status.textContent='Не удалось подтвердить отправку. Повторите попытку или напишите на zhursa03@mail.ru. Заполненные данные сохранены в форме.';}
      finally{delete form.dataset.sending;button.disabled=false;form.removeAttribute('aria-busy');}
    }
  };
  document.querySelectorAll('form').forEach(form=>{
    if(!form.elements.phone)return;
    const trap=document.createElement('input');trap.name='website';trap.type='text';trap.tabIndex=-1;trap.autocomplete='off';trap.setAttribute('aria-hidden','true');trap.style.display='none';form.append(trap);
  });
})();
