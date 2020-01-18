const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
const moment = require('moment');
const PORT = process.env.PORT || 5000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'employee'
});

connection.connect();

const logger = (req, res, next)=> {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`);
    next();
}

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/api/members',(req, res)=> {

   connection
   .query('SELECT * FROM userdata',(err, rows, fields) => {

     if(err) throw err
     res.json(rows);

   });

});

//details

app.get('/api/members/:id',(req, res)=> {

    var id = req.params.id;
    
    connection
    .query(`SELECT * FROM userdata WHERE id = '${id}'`,(err, rows, fields) => {
 
      if(err) throw err

      if(rows.length > 0){
        res.json(rows);
      }else{
          res.status(400).json({msg: `No user with an id of ${id}`});
      }

      
 
    });
 
 });

//create new member
 app.post('/api/members', (req, res)=> {
      var fname = req.body.fname;
      var lname = req.body.lname;
      var email = req.body.email;
      var gender = req.body.gender;
      connection
      .query(`INSERT INTO userdata (first_name, last_name, email, gender)VALUES('${fname}','${lname}','${email}','${gender}')`,(err, rows, fields) => {
        if(err) throw err
        res.json({msg: `1 rows was inserted`});
      });
 });

//  update member
app.put('/api/members', (req, res)=> {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var gender = req.body.gender;
    var id = req.body.id;
    connection
    .query(`UPDATE userdata SET first_name = '${fname}', last_name = '${lname}', email = '${email}', gender = '${gender}' WHERE id = '${id}'`,(err, rows, fields) => {
      if(err) throw err
      res.json({msg: `was updated successfully`});
    });
});

// delete user
app.delete('/api/members', (req, res)=>{
    var id = req.body.id;
    connection
    .query(`DELETE FROM userdata WHERE id = '${id}'`,(err, rows, fields) => {
      if(err) throw err
      res.json({msg: `data was deleted successfully`});
    });
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, ()=> {
    console.log(`Server is started in port ${PORT}`);
})
