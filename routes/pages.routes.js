const router = require("express").Router();
const CoinModel = require("../models/Coin.model");
const axios = require("axios");

function checkUser(req, res, next) {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.redirect("/login");
  }
}

// renders profile.hbs

router.get("/profile", checkUser, (req, res) => {
  res.render("auth/profile.hbs", { loggedInUser: req.session.loggedInUser });
});

// pulls info from profile form, in to req. get by using req.body

router.post("/profile", (req, res, next) => {
  //   console.log(req.body);
  const { coin, purchasedPrice, quantity } = req.body;
  const { _id } = req.session.loggedInUser;
  //   console.log(coin, purchasedPrice, quantity);
  CoinModel.create({
    coin,
    purchasedPrice,
    quantity,
    purchaseValue: purchasedPrice * quantity,
    userId: _id,
  })
    .then(() => {
      console.log("coin selected sucessfully");
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
    });
});
function priceApi() {
  let response = null;
  return new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "824bbdd4-d5e7-4ae8-85e2-358de206f1fa",
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      //   console.log(json);
      resolve(json);
    }
  });
}

router.get("/wallet", checkUser , async (req, res, next) => {
  const { _id } = req.session.loggedInUser;
  const apiResult = await priceApi();
  const apiData = apiResult.data;
  CoinModel.find({ userId: _id })
    .then((data) => {
      console.log("This is the list of coins this user has :=======> ", data);

      let finalData = data.map((ele) => {
        console.log("Ele :=====> ", ele);

        let filteredData = apiData.filter((element) => {
          return element.symbol === ele.coin;
        });

        console.log(
          "This is the coin that matched ele.coin :=====> ",
          filteredData
        );

        const price = filteredData[0].quote.USD.price;
        console.log("price of that coin :========> ", price);

        return {
          coin: ele.coin,
          quantity: ele.quantity,
          purchaseValue: ele.purchaseValue,
          currentValue: (ele.quantity * price).toFixed(0),
          _id: ele._id,
        };
      });

      //   console.log("finalData", finalData);

      res.render("wallet.hbs", { finalData });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/edit/:coinId", (req, res, next) => {
  const { coinId } = req.params;
  CoinModel.findById(coinId)
    .then((data) => {
      // console.log("This is the list of coins this user has :=======> ", data);
      res.render("edit.hbs", { data });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/edit/:coinId", (req, res) => {
  const { coinId } = req.params;
  const { quantity, purchasedPrice } = req.body;
  // console.log(`This is the request body`, req.body);
  CoinModel.findByIdAndUpdate(coinId, {
    purchasedPrice,
    quantity,
    purchaseValue: purchasedPrice * quantity,
  })
    .then(() => {
      res.redirect(`/wallet`);
    })
    .catch((err) => {
      console.log("Some error in finding", err);
    });
});

router.post("/delete/:coinId", (req, res, next) => {
  const { coinId } = req.params;
  CoinModel.findByIdAndDelete(coinId)
    .then(() => {
      res.redirect(`/wallet`);
    })
    .catch((err) => {
      console.log("Some error in finding", err);
    });
});

// news api

const options = {
  method: "GET",
  url: "https://crypto-news-live3.p.rapidapi.com/news",
  headers: {
    "X-RapidAPI-Key": "8784912ff7msh059048cc966813ap157d9fjsnfd45ffdcab31",
    "X-RapidAPI-Host": "crypto-news-live3.p.rapidapi.com",
  },
};



router.get("/chart", (req, res, next) => {
  const { _id } = req.session.loggedInUser;
  let btcTotal = 0
  let ethTotal = 0
  let solTotal = 0
  CoinModel.find({ userId: _id })

    .then((data) => {
      console.log(data)
      for (let obj of data ) {
        console.log(obj)
        if ( obj.coin == "BTC") { 
          btcTotal = btcTotal + obj.purchaseValue
        } else if ( obj.coin == "ETH") {
          ethTotal = ethTotal + obj.purchaseValue
        } else if (obj.coin == "SOL") {
          solTotal = solTotal + obj.purchaseValue
        } 
      }
      let chartData = [btcTotal, ethTotal, solTotal]
      console.log(chartData)
      let chartLabels = ['BTC', 'ETH', 'SOL']
      console.log( `heyhey`, btcTotal )
      // console.log("This is the list of coins this user has :=======> ", data);
      res.render("charts.hbs", {
        chartData: JSON.stringify(chartData),
        chartLabels: JSON.stringify(chartLabels)
      });
    })
    .catch((err) => {
      next(err);
    });
    
});




router.get("/news", (req, res) => {
  axios
    .request(options, { limit: 10 })
    .then(function (response) {
      res.render("news.hbs", { news: response.data });
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
