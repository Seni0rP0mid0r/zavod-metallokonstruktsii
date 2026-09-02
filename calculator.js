'use strict';
(function (root) {
  const numeric = (key, label, value, min, max, step = 1) => ({key,label,value,min,max,step,type:'number'});
  const choice = (key,label,value,options) => ({key,label,value,options,type:'select'});
  const definitions = {
    grating: {name:'Решётчатый настил',fields:[
      choice('type','Тип настила','welded',[['welded','Сварной'],['pressed','Прессованный']]),
      numeric('length','Длина панели, мм',1000,100,3000,10), numeric('width','Ширина панели, мм',1000,100,2000,10),
      choice('mesh','Размер ячейки, мм','33',[['33','33 × 33'],['22','22 × 22'],['44','44 × 44']]),
      choice('bar','Несущая полоса, мм','30',[['25','25 × 2'],['30','30 × 3'],['40','40 × 3'],['50','50 × 5']]),
      choice('finish','Защитное покрытие','zinc',[['none','Без покрытия'],['paint','Окраска'],['zinc','Горячее цинкование']]),
      numeric('quantity','Количество панелей, шт.',10,1,1000)
    ]},
    frame: {name:'Металлоконструкции',fields:[
      numeric('mass','Масса конструкции, т',1,.1,1000,.1),
      choice('steel','Марка стали','c245',[['c245','С245'],['c345','С345']]),
      choice('complexity','Сложность изготовления','standard',[['simple','Балки и колонны'],['standard','Рамы и связи'],['complex','Фермы и сложные узлы']]),
      choice('finish','Защитное покрытие','primer',[['none','Без покрытия'],['primer','Грунтование'],['paint','Окраска'],['zinc','Горячее цинкование']]),
      choice('design','Разработка КМД','no',[['no','По готовой документации'],['yes','Добавить разработку КМД']]),
      numeric('quantity','Количество комплектов',1,1,100)
    ]},
    cabin: {name:'Блок-контейнеры',fields:[
      choice('size','Размер модуля, м','6',[['3','3 × 2,4'],['6','6 × 2,4'],['9','9 × 2,4']]),
      choice('insulation','Утепление, мм','100',[['50','50 мм'],['100','100 мм'],['150','150 мм']]),
      choice('interior','Внутренняя отделка','board',[['none','Без отделки'],['board','ЛДСП'],['metal','Окрашенный металл']]),
      choice('electric','Электрика','yes',[['no','Без электрики'],['yes','Освещение и розетки']]),
      choice('windows','Количество окон','2',[['0','Без окон'],['1','1 окно'],['2','2 окна'],['3','3 окна']]),
      numeric('quantity','Количество модулей, шт.',1,1,100)
    ]},
    doors: {name:'Двери',fields:[
      numeric('width','Ширина проёма, мм',900,600,2400,10),numeric('height','Высота проёма, мм',2100,1800,3000,10),
      choice('leaves','Исполнение','single',[['single','Однопольная'],['double','Двупольная']]),
      choice('insulation','Теплоизоляция','wool',[['none','Без утепления'],['wool','Минеральная вата']]),
      choice('finish','Покрытие','powder',[['primer','Грунт'],['powder','Порошковая окраска']]),
      choice('hardware','Фурнитура','standard',[['standard','Стандартный комплект'],['closer','С доводчиком'],['panic','Антипаника']]),
      numeric('quantity','Количество, шт.',1,1,100)
    ]},
    ventilation: {name:'Вентиляционные системы',fields:[
      choice('section','Сечение воздуховода','round',[['round','Круглое'],['rect','Прямоугольное']]),
      numeric('width','Диаметр / ширина, мм',200,100,1600,10),numeric('height','Высота прямоугольного сечения, мм',200,100,1600,10),
      numeric('length','Длина трассы, м',10,1,1000,.5),
      choice('material','Материал','galvanized',[['galvanized','Оцинкованная сталь'],['stainless','Нержавеющая сталь']]),
      choice('thickness','Толщина металла, мм','05',[['05','0,5 мм'],['07','0,7 мм'],['10','1,0 мм']]),
      numeric('fittings','Отводы и переходы, шт.',2,0,100),
      choice('insulation','Изоляция','none',[['none','Без изоляции'],['thermal','Теплоизоляция']])
    ]},
    water: {name:'Очистные сооружения',fields:[
      numeric('volume','Объём резервуара, м³',10,1,500,.5),
      choice('material','Материал резервуара','steel',[['steel','Углеродистая сталь'],['stainless','Нержавеющая сталь']]),
      choice('treatment','Комплектация очистки','mechanical',[['tank','Только резервуар'],['mechanical','Механическая очистка'],['bio','Биологическая очистка']]),
      choice('pump','Насосное оборудование','yes',[['no','Без насосов'],['yes','Добавить насосный блок']]),
      choice('automation','Автоматика','basic',[['none','Без автоматики'],['basic','Базовый шкаф'],['full','Контроль и сигнализация']]),
      numeric('quantity','Количество комплектов',1,1,100)
    ]}
  };
  function defaults(key) { return Object.fromEntries(definitions[key].fields.map(f=>[f.key,f.value])); }
  function validate(key,values) {
    return !!definitions[key] && !!values && definitions[key].fields.every(f=>f.type==='select' ? f.options.some(o=>o[0]===values[f.key]) :
      Number.isFinite(values[f.key]) && values[f.key]>=f.min && values[f.key]<=f.max && Math.abs((values[f.key]-f.min)/f.step-Math.round((values[f.key]-f.min)/f.step))<.00001);
  }
  function calculate(key,v) {
    if (!validate(key,v)) return null;
    let base=0,extras=0,summary='',lines=[];
    if(key==='grating') {
      const area=v.length*v.width/1e6, mesh={'33':1,'22':1.28,'44':.88}[v.mesh], bar={'25':.82,'30':1,'40':1.22,'50':1.8}[v.bar];
      base=area*6500*mesh*bar*(v.type==='pressed'?1.15:1); extras=base*{none:0,paint:.1,zinc:.2}[v.finish];
      summary=(area*v.quantity).toLocaleString('ru-RU',{maximumFractionDigits:2})+' м² · '+v.quantity+' панелей';
      lines=[['Настил, с учётом ячейки и полосы',base*v.quantity],['Защитное покрытие',extras*v.quantity]];
    } else if(key==='frame') {
      base=v.mass*125000*{c245:1,c345:1.16}[v.steel]*{simple:.85,standard:1,complex:1.35}[v.complexity];
      const coat=v.mass*{none:0,primer:7000,paint:16000,zinc:28000}[v.finish],design=v.design==='yes'?Math.max(18000,base*.06):0;
      extras=coat+design;summary=v.mass+' т / комплект · '+v.quantity+' компл.';
      lines=[['Изготовление и металл',base*v.quantity],['Защитное покрытие',coat*v.quantity],['Разработка КМД',design*v.quantity]];
    } else if(key==='cabin') {
      base=185000*{'3':.68,'6':1,'9':1.42}[v.size];
      const insulation={'50':0,'100':24000,'150':47000}[v.insulation]*(Number(v.size)/6),interior={none:0,board:22000,metal:35000}[v.interior]*(Number(v.size)/6),equipment=(v.electric==='yes'?18000:0)+Number(v.windows)*9500;
      extras=insulation+interior+equipment;summary=v.size+' × 2,4 м · '+v.quantity+' шт.';
      lines=[['Корпус модуля',base*v.quantity],['Утепление и отделка',(insulation+interior)*v.quantity],['Электрика и окна',equipment*v.quantity]];
    } else if(key==='doors') {
      const area=v.width*v.height/1e6;
      base=area*14500*(v.leaves==='double'?1.22:1);
      const insulation=v.insulation==='wool'?area*1800:0, finish=area*(v.finish==='powder'?2400:700),hardware={standard:4500,closer:9000,panic:19000}[v.hardware];
      summary=v.width+' × '+v.height+' мм · '+v.quantity+' шт.';
      lines=[['Полотно и коробка',base*v.quantity],['Утепление и покрытие',(insulation+finish)*v.quantity],['Фурнитура',hardware*v.quantity]];
    } else if(key==='ventilation') {
      const perimeter=v.section==='round'?Math.PI*v.width/1000:2*(v.width+v.height)/1000;
      const area=perimeter*v.length;
      base=area*2400*(v.material==='stainless'?2.1:1)*{'05':1,'07':1.25,'10':1.65}[v.thickness];
      const fittings=v.fittings*1800*(v.material==='stainless'?1.8:1), insulation=v.insulation==='thermal'?area*950:0;
      summary=v.length+' м трассы · '+area.toLocaleString('ru-RU',{maximumFractionDigits:1})+' м² металла';
      lines=[['Прямые участки',base],['Отводы и переходы',fittings],['Изоляция',insulation]];
    } else {
      base=(180000+v.volume*12000)*{steel:1,stainless:1.85}[v.material];
      const treatment={tank:0,mechanical:70000,bio:190000}[v.treatment],pump=v.pump==='yes'?50000:0,automation={none:0,basic:30000,full:85000}[v.automation];
      extras=treatment+pump+automation;summary=v.volume+' м³ · '+v.quantity+' компл.';
      lines=[['Резервуар',base*v.quantity],['Комплектация очистки',treatment*v.quantity],['Насосы и автоматика',(pump+automation)*v.quantity]];
    }
    lines=lines.map(([label,value])=>[label,Math.round(value)]);
    return {total:lines.reduce((s,x)=>s+x[1],0),lines,summary};
  }
  const api={definitions,defaults,validate,calculate};
  if(typeof module!=='undefined' && module.exports) module.exports=api; else root.MetalCalculator=api;
})(typeof window==='undefined'?{}:window);
