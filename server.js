
const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const mydb = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root123",
    database: "iacsd"
};

const connection = mysql2.createConnection(mydb);

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed", err);
        return;
    }

    console.log("Connected to MySQL");
    initializeDb();
});

function executeQuery(query,value,response){
    connection.query(query,value,(err,result)=>{
        if(err){
            return response.status(500).json({
                success:false,
                error:err.message
            });
        }
        response.json({
            success:true,
            data:result
        })
    })
}


function initializeDb(){
    connection.query(`CREATE TABLE IF NOT EXISTS emp(
            no INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50),
            address VARCHAR(100)
        )`,
        (err)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log("Table created or already exists");
        }

    )
}


app.get("/employee",(req,res)=>{
    executeQuery("select * from emp",[],res);
});


app.post("/employee",(req,res)=>{
    const {name,address}=req.body;
    executeQuery("Insert into emp(name,address) values (?,?)",
    [name,address],
    res
    );
});

app.put("/employee/:no",(req,res)=>{
    const {name,address}=req.body;
    executeQuery(
    "update emp set name=?,address=? where no=?",
    [name,address,req.params.no],
    res
    );
})


app.delete("/employee/:no",(req,res)=>{

    executeQuery("delete from emp where no=?",
        [req.params.no],
        res
    );
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});
