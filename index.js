require('dotenv').config()
const { leerInput,
        abcMenu,
        pausawe, listarLugares } = require("./helpers/inquirer")
const {Busquedas}=require('./models/busquedas')

//console.log(process.env)
const main = async()=>{
    const busquedas = new Busquedas();
    let opt="";
    do{
        opt= await abcMenu();
        
        switch(opt){
            case 1:
                //message
                const lugar = await leerInput();
                const lugares = await busquedas.ciudad(lugar)
                //selecionar lugar
                const id = await listarLugares(lugares)
                if(id==='0')continue;

                const lugarSel = lugares.find(l=>l.id===id)
               
                busquedas.agregarHist(lugarSel.nombre)                
                const clima = await busquedas.CondMet(lugarSel.lat, lugarSel.lng)
                
                console.clear()
                console.log('\ninfomarción de la ciudad\n'.green)
                console.log('Ciudad:', lugarSel.nombre.green)
                console.log('Lat:', lugarSel.lat)
                console.log('Lng:', lugarSel.lng)
                console.log('Temperatura:', clima.temp)
                console.log('Min:', clima.min)
                console.log('Max:', clima.max)
                console.log('Condicion climática:', clima.desc.green)
            break;
                case 2:
                    busquedas.historialCapitalizado.forEach((lugar, i)=>{
                        const idx = `${i+1}.`.green
                        console.log(`${idx} ${lugar}`)
                    })
                        

            break;}
        
        if(opt !==0) await pausawe()
    }while(opt !== 0);

}
main();