import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import { dirname} from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const port = process.env.PORT || 3000
const letters = [];
generateAlphabet()

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async(req,res) => {
    try{
      const rand = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      const result = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a')
      const data = result.data.drinks
      const randomDrink = rand.data.drinks
      res.render(__dirname + '/views/index.ejs',{
        data:data,
        rand:randomDrink,
        letters:letters,
      })
    }catch(error){
      res.send(error.message)
    }
  });
  
app.post('/search', async (req,res) => {
  try{
    const smallLetter = req.body.search
    const [rand,result] = await Promise.all([
      await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php',{
        params:{
          s:smallLetter,
        }
      })
    ])
    const data = result.data.drinks
    const randomDrink = rand.data.drinks
    res.render(__dirname + '/views/index.ejs',{
      data:data,
      rand:randomDrink,
      letters:letters,
    })
  }catch(error){
    res.send(JSON.stringify(error.message))
  }

  });

app.post('/submit', async (req,res) => {
  try{
    const smallLetter = req.body.letter.toLowerCase()
    const [rand,result] = await Promise.all([
      await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
      await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php',{
        params:{
          f:smallLetter,
        }
      })
    ])
    const data = result.data.drinks
    const randomDrink = rand.data.drinks
    res.render(__dirname + '/views/index.ejs',{
      data:data,
      rand:randomDrink,
      letters:letters,
    })
  }catch(error){
    res.send(JSON.stringify(error.message))
  }
  });

  app.post('/filter', async(req,res) => {
    try{
      const [rand, result] = await Promise.all([
        axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
        axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php', {
          params: { c:req.body.filter },
        })
      ]);
      const data = result.data.drinks
      const randomDrink = rand.data.drinks
      res.render(__dirname + '/views/index.ejs',{
        category:data,
        rand:randomDrink,
        letters:letters,
      })
    }catch(error){
      res.send(JSON.stringify(error.message))
    }
  });

  app.post('/alcohol', async(req,res) => {
    try{
      const [rand, result] = await Promise.all([
        axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php'),
        axios.get('https://www.thecocktaildb.com/api/json/v1/1/filter.php', {
          params: { a:req.body.alcohol },
        })
      ]);
      const data = result.data.drinks
      const randomDrink = rand.data.drinks

      res.render(__dirname + '/views/index.ejs',{
        category:data,
        rand:randomDrink,
        letters:letters,
      })
    }catch(error){
      res.send(JSON.stringify(error.message))
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  function generateAlphabet() {
    for (let i = 65; i <= 90; i++) {
        letters.push(String.fromCharCode(i));
    }
}

// module.exports = app;