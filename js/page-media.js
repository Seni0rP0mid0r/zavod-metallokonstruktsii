/* Реальные фото перенесены с etalonrussia.ru. Полный источник и назначение — assets/photos/PHOTO_REGISTRY.md. */
const photo = (src, title, text) => ({src:'assets/photos/'+src, title, text});
const grating = [
  photo('grating-krasnoe-beloe-01.jpg','Сварной настил · «Красное&Белое»','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('grating-krasnoe-beloe-02.jpg','Сварной настил · «Красное&Белое»','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('grating-krasnoe-beloe-03.jpg','Сварной настил · «Красное&Белое»','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('grating-krasnoe-beloe-04.jpg','Сварной настил · «Красное&Белое»','Реальная фотография выполненного проекта из опубликованной галереи.')
];
const structures = [
  photo('structures-mosgortrans-01.jpg','Металлоконструкции · Мосгортранс','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('structures-mosgortrans-02.jpg','Металлоконструкции · Мосгортранс','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('structures-mosgortrans-03.jpg','Металлоконструкции · Мосгортранс','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('structures-mosgortrans-04.jpg','Металлоконструкции · Мосгортранс','Реальная фотография выполненного проекта из опубликованной галереи.')
];
const cabins = [
  photo('cabins-gazprom-01.jpg','Вагон-бытовка · Газпром','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('cabins-gazprom-02.jpg','Вагон-бытовка · Газпром','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('cabins-gazprom-03.jpg','Вагон-бытовка · Газпром','Реальная фотография выполненного проекта из опубликованной галереи.'),
  photo('cabins-gazprom-04.jpg','Вагон-бытовка · Газпром','Реальная фотография выполненного проекта из опубликованной галереи.')
];

const projectGroups = window.EtalonProjectGroups || [];
const groupPhotos = (...categories) => projectGroups.filter(group => categories.includes(group.category)).flatMap(group => group.items);
const chassisPhotos = projectGroups.find(group => group.id === 'rzd-chassis')?.items || cabins;
const rzdCabinPhotos = projectGroups.find(group => group.id === 'rzd-cabin')?.items || cabins;

window.EtalonGallery = {
  default: grating,
  grating: groupPhotos('grating'), welded: projectGroups.find(group => group.id === 'grating-kb')?.items || grating,
  pressed: groupPhotos('grating').filter(item => !item.title.includes('Красное&Белое')),
  structures: groupPhotos('structures'),
  cabins: groupPhotos('cabins'), 'site-cabins': groupPhotos('cabins'), 'chassis-cabins': chassisPhotos,
  projects: window.EtalonProjectArchive || [...grating, ...structures, ...cabins]
};
window.EtalonLocation = {address:'Псковская область, Великие Луки', latitude:56.34, longitude:30.53, cityOnly:true};
