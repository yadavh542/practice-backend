const express = require("express"); 
const app = express();
const port = 8081;
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "yadav",
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
})

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Hello HomePage")
});



app.listen(port,()=>console.log(`server is running on port ${port}`));


const selectQuery=(req, res)=>{
    const {queryInput, name, email} = req.body;
    console.log("queryInput", queryInput);

    pool.query(`${queryInput}`, (err, result)=>{
        if(err){
            console.log(err)
            // throw err;
        }

        res.status(200).json({data: result?.rows});
    })


}

const updateQuery=(req, res)=>{
    const {queryInput} = req.body;

    res.status(200).json({msg: `Successfully updated query ${queryInput}` });
}

const insertQuery=(req, res)=>{
    const {queryInput, name, email} = req.body;

    if (!name || !email || !queryInput) {
        return res.status(400).json({ error: "query, Name and email are required fields." });
    }

    pool.query(queryInput, [name, email], (err, result)=>{
        if(err){
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Failed to insert data into the database." });
        }
        res.status(200).json({msg: "Successfully inserted query", data: result.rows[0]})
    })

    // res.status(200).json({msg: `Successfully inserted query ${name}`});
}


app.post("/select-query", selectQuery);

app.post("/update-query", updateQuery);

app.post("/insert-query", insertQuery);