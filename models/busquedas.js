const fs = require('fs')
const axios = require('axios')

class Busquedas{
    historial=[];
    dbPath='./db/database.json';

    constructor(){
        this.readDb()
    }
    get historialCapitalizado() {
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

            return palabras.join(' ')

        })
    }
    get naguara(){
        return {"access_token":process.env.MAPBOX_KEY,
            'limit': 6,
            'language':'es'    
            }
    }
    
    
    async ciudad(lugar=''){
         try{//https petición
             const instance = axios.create({
                 baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                 params:this.naguara,
             });
             const resp = await instance.get();
             return resp.data.features.map(lugar=>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
             }));
            
         
         }catch(error){
             return [];
         }     
    } 
    get naguara2(){
        return {
            "appid":process.env.OPENWEATHERMAP_KEY,
            'units':'metric',
            'lang':'es'
        }
    }
    
    async CondMet(lat, lon){
        try{
            const instace2 = axios.create({
                baseURL:'https://api.openweathermap.org/data/2.5/weather',
                params:{...this.naguara2,
                lat, lon}

            })

            const resp2 = await instace2.get();
            const {weather, main} = resp2.data;
                return {
                    desc:weather[0].description,
                    min: main.temp_min,
                    max:main.temp_max,
                    temp:main.temp,
                }
        }catch(error){
            console.log(error)
        }
    }
    agregarHist(lugar=''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());
        this.saveDB()
    }

    saveDB(){
        const payload ={
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    readDb(){
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse(info)

        this.historial=data.historial
    }

}

module.exports={
    Busquedas
}