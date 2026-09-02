const assert = require('node:assert/strict');
const c = require('../js/calculator.js');
const g = c.defaults('grating');
assert.equal(c.calculate('grating', g).total, 78000);
assert.equal(c.calculate('grating', {...g,finish:'none'}).total,65000);
assert.equal(c.calculate('grating', {...g,finish:'none',mesh:'22'}).total,83200);
assert.equal(c.calculate('grating', {...g,length:2000}).total,156000);
assert.equal(c.calculate('frame', {...c.defaults('frame'),mass:2}).total,264000);
assert.equal(c.calculate('cabin', c.defaults('cabin')).total,268000);
assert.equal(c.calculate('water', {...c.defaults('water'),volume:20}).total,570000);
assert.equal(c.calculate('grating',{...g,type:'pressed'}).total,89700);
assert.equal(c.calculate('doors',c.defaults('doors')).total,39843);
assert.equal(c.calculate('ventilation',{...c.defaults('ventilation'),section:'rect'}).total,22800);
for(const [key,def] of Object.entries(c.definitions)){
  const defaults=c.defaults(key);
  for(const field of def.fields){
    const values=field.type==='select'?field.options.map(x=>x[0]):[field.min,field.max];
    for(const value of values){
      const r=c.calculate(key,{...defaults,[field.key]:value});
      assert.ok(r && Number.isFinite(r.total) && r.total>0,key+': '+field.key);
      assert.equal(r.total,r.lines.reduce((sum,line)=>sum+line[1],0));
    }
    if(field.type==='number'){
      for(const invalid of [NaN,Infinity,field.min-field.step,field.max+field.step,field.min+field.step/2]){
        assert.equal(c.calculate(key,{...defaults,[field.key]:invalid}),null);
      }
    }
  }
}
console.log('PASS: category formulas, option variants, bounds, invalid inputs, breakdown totals');
