//Constants dos modulos
const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const handlebars=require('express-handlebars');
const app=express();


//bdy-parser padrão
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql=mysql.createConnection({
    host:'localhost',
    user:'francisco',
    password:'12345',
    port:3306
 });
 sql.query("use node");




//TEMPLATE ENGINE DO HANDLEBARS - ISSO E PADRAO
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');

//lincar o saqruvos de css e js e img
app.use("/css",express.static("css"))
app.use("/js",express.static("js"))
app.use("/img",express.static("img"))





//Rotas erotas e rotas para o index
app.get("/",function(req,res){
    //res.send("ESTA É MINHA PAGINA INICIAL")
    //res.sendFile(__dirname+"/index.html");
   // console.log(req.params.id)
   //res.render("index",{id:req.params.id})  manda o id do paraemtro para o index fronte ende
   res.render("index");
})


//ROTA INSERIR PARA O FORMULLARIO
app.get("/inserir",function(req,res){
    res.render("inserir");
});

//ROTA PARA MOSTRAR OD DADOS INSERIDOS
app.get("/select/:id?",function(req,res){
    if(!req.params.id){
        sql.query("select * from user order by id asc",function(err,results,fields){
           res.render('select',{data:results});
        });
    }else{
        sql.query("select * from user where id=? order by id asc",[req.params.id],function(err,results,fields){
            res.render('select',{data:results});
        });
    }
});


//pegando o dados do formulario e colocando no bnco dde dados
app.post("/controllerForm",urlencodeParser,function(req,res){
    sql.query("insert into user values (?,?,?)",[req.body.id,req.body.name,req.body.age]);
    res.render('controllerForm',{name:req.body.name});
});



//DELETANDO NO BANCO DE DADOS
app.get('/deletar/:id',function(req,res){
    sql.query("delete from user where id=?",[req.params.id]);
    res.render('deletar');
});



//UPDATE
// JOGANDO DO BANCO DE DADOS NO FORMULARIO
app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].idade});
    });
});

//FAZEDO O UPADTE E SALVANDO DE NOVO NO FORMULARIO
app.post("/controllerUpdate",urlencodeParser,function(req,res){
   sql.query("update user set name=?,idade=? where id=?",[req.body.name,req.body.age,req.body.id]);
   res.render('controllerUpdate');
});







//servidor rodando na porta 3000
app.listen(3000,function(req,res){
   console.log('Servidor está rodando!');
});