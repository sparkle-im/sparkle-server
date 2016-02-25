import express from 'express';
class Main {
    static main(args) {
        var app = express();

        app.get('/', function (req, res) {
            res.send('Hello World!');
        });

        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
        });
        
    }
}

Main.main(process.argv);