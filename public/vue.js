var app = new Vue({
  el: '#app',
  data: {
    title: "Ei vielä elokuvaa",
    haettu: "Avengers:Endgame",
    osoite: " ",
    //'http://www.omdbapi.com/?t=ant-man&apikey=d20392f7'
    year: 0,
    poster: "",
    imdbRating: 0,
    yourRating: 5,
    watchDay: "",
    review: "",
    nayta: false,
    arvostelut: [],
    id: 0,
    edellinenID: 0,
    montaElokuvaa: false
  },
  computed: {
    valitutElokuvat(event) {
      return this.arvostelut.filter((value) => {
        return value.active == true;
      }
      )
    }
  },
  methods: {
    tallenna: function (event) {
      let onkoLisatty = this.arvostelut.findIndex((arvostelu) => arvostelu.title == this.title)



      if (onkoLisatty == -1) {
        this.id++;
        let arvostelu = { id: this.id, active: false, title: this.title, year: this.year, poster: this.poster, imdbRating: this.imdbRating, yourRating: parseFloat(this.yourRating), review: this.review, watchDay: this.watchDay };
        // arvostelu={title,year,poster,imdbRating,yourRating,review}

        axios.post("/api/reviews", arvostelu).then((saved) => {
          arvostelu.id = saved.data.id
          console.log(arvostelu.id)
          this.arvostelut.push(arvostelu);

        }
        )



      }
      else {
        if (confirm("Oli jo listalla, päivitetäänkö?")) {
          let arvostelu = { id: this.arvostelut[onkoLisatty].id, active: false, title: this.title, year: this.year, poster: this.poster, imdbRating: this.imdbRating, yourRating: parseFloat(this.yourRating), review: this.review, watchDay: this.watchDay };

          console.log(arvostelu.id)

          this.arvostelut = this.arvostelut.filter((arvosteluTaulukossa) => {
            return arvostelu.id !== arvosteluTaulukossa.id
          })


          axios.patch(`/api/reviews/${arvostelu.id}`, arvostelu).then((updated) => {
            this.arvostelut.push(arvostelu);
          })
        }
      }
      this.nayta = false;
      this.review = "";
      this.yourRating = 5;
      this.haettu = "";

    },
    haku: function (event) {

      this.osoite = `https://www.omdbapi.com/?t=${this.haettu}&apikey=d20392f7`
      axios.get(app.osoite).then(function (response) {
        app.nayta = true;
        // console.log(response);
        app.title = response.data.Title;
        app.year = response.data.Year
        app.poster = response.data.Poster;
        app.imdbRating = response.data.imdbRating;
        var d = new Date();
        app.watchDay = d.toLocaleDateString();
        app.haettu = "";
        if (!app.title) {

          app.nayta = false;
        }

      })
        .catch(function (error) {
          console.log("IN CATCH")
          app.answer = 'Error! Could not reach the API. ' + error
          app.title = "virhe haussa!"

        })
    },
    jarjestaIMDB: function (event) {
      this.arvostelut.sort((a, b) => {
        return b.imdbRating - a.imdbRating
      })


    },
    jarjestaSinunArvio: function (event) {


      this.arvostelut.sort((a, b) => {
        return b.yourRating - a.yourRating
      })

    },
    jarjestaAakkoset: function (event) {
      this.arvostelut.sort((a, b) => {
        return a.title.localeCompare(b.title)
      })
    },
    jarjestaLisaysJ: function (event) {
      this.arvostelut.sort((a, b) => {
        return a.day - b.day
      })
    },
    arvosteluKunnossa: function (event) {
      if (this.yourRating > 10) {
        this.yourRating = 10;
      }
      if (this.yourRating < 0) {
        this.yourRating = 0;
      }
    },
    nollaaNaytot: function (event) {
      this.montaElokuvaa = false;
      this.edellinenID = 0;
      this.arvostelut.forEach((value) => {
        value.active = false;
      }

      )
    },
    naytatTiedot: function (id_parametrina) {

      // this.arvostelut.find( ( {id} ) => console.log("{id}"+ id) );

      // this.arvostelut.find( ( id ) =>   console.log("(id)"+id.id));


      const nayta = this.arvostelut.find(({ id }) => id === id_parametrina);
      nayta.active = true;

      const piilotaEdellinen = this.arvostelut.find(({ id }) => id === this.edellinenID);
      if (piilotaEdellinen) {
        piilotaEdellinen.active = false;
      }

      if (this.edellinenID == id_parametrina) {
        nayta.active = true;
      }

      this.edellinenID = id_parametrina;


    },
    poista: function (id_parametrina) {
      const poista = this.arvostelut.find(({ id }) => id === id_parametrina);
      poista.active = false;

      this.arvostelut = this.arvostelut.filter(function (arvostelu) {
        return arvostelu.id != id_parametrina;
      });

      axios.delete(`/api/reviews/${id_parametrina}`).then(() => {
        console.log("poistettu")
      })
    },
    lataus: function () {
      axios.get("/api/reviews").then((loaded) => {

        loaded.data.forEach((one) => {

          const arvostelu =
          {
            id: one.id, active: false, title: one.title, year: one.year, poster: one.poster, imdbRating: parseFloat(one.imdb), yourRating: parseFloat(one.rating), review: one.review, watchDay: one.day
          };



          this.arvostelut.push(arvostelu)
        })

      })
    }

  }, beforeMount() {
    this.lataus()
  }
})



