var express = require('express');
var app = express();
var http = require('http').Server(app);
var CronJob = require('cron').CronJob;
var bodyParser     = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
var mongoose = require('mongoose');
// replace the value below with the Telegram token you receive from @BotFather
const token = 'gi';
mongoose.connect('mongodb://localhost/bottelegram');
var Promise = require('mpromise');
var helmet = require('helmet')
app.use(helmet())
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs');
app.set('view engine', 'pug');

app.use(bodyParser.json()); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
mongoose.Promise = global.Promise
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
var METAinlinebot = mongoose.model('metainlinebot', {
    type : {type : String, default:'article'},
    id : {type:String},
    title : {type : String, default: ''},
    description : {type : String, default: ''},
    message_text:{type:String,default:''},
    created_at : {type : Date, default: Date.now}
});
var metapernyataan = mongoose.model('metapernyataan',{
    pernyataan :{type:String,default:''},
    balasan : {type:String,default:''}
})
// Matches "/echo [whatever]"
bot.onText(/\/jomblo/,(msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "hello mblo");
});
app.get("/",function(req,res){
  res.render("metadata.ejs");
})
bot.onText(/\/tampilgombal (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "gombalan Not null");
});
bot.onText(/\/start/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "gombalan akan saya mulai. gombalan ini akan membuat anda baper");
});

bot.onText(/\/help/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  var opts ={
      parse_mode :'HTML'
  }
  const parse_mode = 'HTML';
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, "perintah yang ada di bot Gombalan:<strong>/start : mulai</strong>",opts);
});
// Listen for any kind of message. There are different kinds of
// messages..log
bot.onText(/\/insult/, function(msg, match) {
  var fromId = msg.from.id;
  var insults = ["Dumbass", "Out of 100,000 sperm, you were the fastest?", "Look, you aint funny. Your life is just a joke."];
  var chosenInsult = insults[Math.floor(Math.random() * insults.length)];
  bot.sendMessage(fromId, chosenInsult);
});
app.post("/api/databot",function(req,res){
     var metainlinebot = new METAinlinebot();
          metainlinebot.id = req.body.id;
          metainlinebot.title = req.body.title;
          metainlinebot.description = req.body.description;
          metainlinebot.message_text = req.body.message;
		      metainlinebot.save(function(){
    	      res.end()
 	     });
});
app.get("/api/databot",function(req,res){
  METAinlinebot.find().exec().then(function(docs){
       res.json(docs);
    });
});
app.put("/api/databot",function(req,res){
        var title = req.body.title;
        var description = req.body.description;
        var id = req.body.id;
        var idinput = req.body.idinput;
        METAinlinebot.update({ _id: id }, { $set: {title:title,description:description, id:idinput}},function(){
            res.end()
        });
})
app.delete("/api/databot/:id",function(req,res){
  var id = req.params.id;
  METAinlinebot.remove({_id:id},function(err,docs){
        res.end();
    });
})
app.get("/pernyataan",function(req,res){
    res.render("pernyataan.ejs");
})
bot.on("inline_query", (query) => {
METAinlinebot.find().exec().then(function(docs){
  console.log(docs);
    bot.answerInlineQuery(query.id, docs);
  })
});
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const nama = msg.chat.first_name;
  metapernyataan.find({pernyataan:msg.text},function(docs){
    console.log(docs)
      // if(docs == null){
      //     bot.sendMessage(chatId,"sebentar saya catat dulu kata tersebut");
      //     var metapernyataanbot = new metapernyataan();
      //     metapernyataanbot.pernyataan = msg.text;
		  //     metapernyataanbot.save(function(){
    	        
 	    //  });  
      // }else{
      //     bot.sendMessage(chatId,docs.balasan);
      // }
  })
});
 bot.onReplyToMessage("reply_message_to",function(msg){
    bot.sendMessage(chatId,"Hello "+nama+" ada apa?")
});
http.listen('3000');