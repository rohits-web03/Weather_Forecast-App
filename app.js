require('dotenv').config();
const express=require('express');
const https=require('https');
const bodyParser=require('body-parser');
const app=express();
const port=process.env.PORT || 8000;
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");    
})
app.post("/",function(req,res){
    const query=req.body.cityName;
    const apikey=process.env.API_KEY;
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+unit;
    https.get(url,function(response){
        //console.log(response.statusCode);

        response.on("data",function(data){
            //console.log(data);
            const weatherData=JSON.parse(data);
            const temp=weatherData.main.temp;
            const weatherDescription=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const imageURL="https://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write("<h1>The temperature in "+query+" is "+temp+" degree celcius.</h1>");
            res.write("<p>The weather is currently "+weatherDescription+"</p>");
            res.write("<img src="+imageURL+">");
            res.send();

        })
    })
})

app.listen(port,function(){
    console.log(`Server is running on port ${port}`);
})