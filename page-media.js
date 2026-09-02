// Replace these paths with real project photos. Titles remain editable per category.
window.EtalonGallery = {
 default: [
  {src:'assets/project-placeholder-1.svg',title:'Общий вид объекта',text:'Место для фотографии готового проекта. Изображение будет заменено.'},
  {src:'assets/project-placeholder-2.svg',title:'Изделие в деталях',text:'Место для фотографии узлов, покрытия и соединений.'},
  {src:'assets/project-placeholder-3.svg',title:'Результат на объекте',text:'Место для фотографии установленной продукции.'}
 ]
};
// Add confirmed coordinates and address to display a real map marker.
window.EtalonLocation = {address:'Псковская область, Великие Луки', latitude:56.34, longitude:30.53, cityOnly:true};
window.EtalonGallery.doors = [1,2,3].map(number=>({src:'assets/showcase-modules.png',title:'Пример галереи · '+number+' / 3',text:'Концептуальная иллюстрация модульного здания с дверями. Не фотография выполненного проекта.'}));
