var app = new Vue({
    el: '#app',
    data: {
        title:"Ei vielä elokuvaa",  
        haettu:"Avengers:Endgame",
        osoite:" ",
      //'http://www.omdbapi.com/?t=ant-man&apikey=d20392f7'
        year:0,
        poster:"",
        imdbRating:0,
        yourRating:5,
        watchDay:"",
        review:"",
        nayta:false,
        arvostelut:[],
        id:0,
        edellinenID:0,
        montaElokuvaa: false
      },
    computed:{
          valitutElokuvat(event)       //taulukko valituista (active==true) elokuvista
          {
            return this.arvostelut.filter((value)=>
            {
              return value.active==true;
            }
            )
          }
    },
    methods:{
        tallenna: function(event)   //metodi tallennukselle
        { 
            //löytyykö elokuva jo listattuna
          let onkoLisatty = this.arvostelut.findIndex((arvostelu) => arvostelu.title == this.title)
          if(onkoLisatty == -1)
          {
         
            //lisätään jos ei viel ole
          this.id++;
          arvostelu={id:this.id,active:false,title:this.title,year:this.year,poster:this.poster,imdbRating:this.imdbRating,yourRating:parseFloat(this.yourRating),review:this.review,watchDay:this.watchDay};
         
          this.arvostelut.push(arvostelu);

          //tyhjätään tiedot
          this.nayta=false;
          this.review= "";
          this.yourRating=5;
          this.haettu = "";
          
        }
        else    //elokuva oli jo listalla
        {
          alert("Kyseinen elokuva oli jo listalla");
          this.nayta = false;
          this.haettu = "";
        }
        },
        haku: function (event)   //Haun suorittaminen API:sta
            {
              
               this.osoite = `https://www.omdbapi.com/?t=${this.haettu}&apikey=d20392f7`
             axios.get(app.osoite).then(function (response) 
             {
               //Hausta saadut tiedot
                app.nayta=true;
               console.log(response);
                app.title = response.data.Title;
                app.year = response.data.Year
                app.poster = response.data.Poster;
                app.imdbRating = response.data.imdbRating;
                var d = new Date();
                app.watchDay = d.toLocaleDateString();
              if(!app.title)  //jos ei saatu mitään, piilotetaan tulokset
              {
                
                app.nayta=false;
              }
               
             })
        .       catch(function (error) {      //virheen käsittely
              console.log("IN CATCH")
                app.answer = 'Error! Could not reach the API. ' + error
                app.title = "virhe haussa!"
                
             })
            },

            //Neljää seuraavaa käytetään elokuvien järjestämiseen
            jarjestaIMDB: function(event)
            {
              this.arvostelut.sort((a,b)=>
              {
                return b.imdbRating.localeCompare(a.imdbRating)
              })

              
            },
            jarjestaSinunArvio: function(event)
            {
                  

              this.arvostelut.sort((a,b)=>
              {
                return b.yourRating - a.yourRating
              })

            },
            jarjestaAakkoset: function(event)
            {
             this.arvostelut.sort((a,b)=>
              {
                return a.title.localeCompare(b.title)
              })
            },
            jarjestaLisaysJ: function(event)
            {
              this.arvostelut.sort((a,b)=>
              {
                return a.id - b.id
              })
            },

            //annettu arvostelu on oikein muotoinen
            arvosteluKunnossa: function(event)
            {
              if(this.yourRating > 10)
              {
                this.yourRating = 10;
              }
              if(this.yourRating < 0)
              {
                this.yourRating = 0;
              }
            },

            //nollataan valitut kun vaihdetaan näytettävä monesta -> yhteen
            nollaaNaytot: function(event)
            {
              this.montaElokuvaa = false;
              this.edellinenID = 0;
             this.arvostelut.forEach((value)=>
             {
               value.active = false;
             }
             
             )
            },

            //kun käytetään yhden näyttmistä
            naytatTiedot: function(id_parametrina)
            {

            // this.arvostelut.find( ( {id} ) => console.log("{id}"+ id) );
              
            // this.arvostelut.find( ( id ) =>   console.log("(id)"+id.id));

              //etsitään näytettävä
              const nayta = this.arvostelut.find( ( {id} ) => id === id_parametrina );
              nayta.active = true;

              //piilotetaan edellinen näytettävä
              const piilotaEdellinen = this.arvostelut.find( ( {id} ) => id === this.edellinenID );
              if(piilotaEdellinen)
              {
                piilotaEdellinen.active=false;
              }

              //jos yritetään näyttää samaa, ei piiloteta
              if(this.edellinenID == id_parametrina)
              {
                nayta.active = true;
              }

              //merkataan nykyinen edelliseksi uutta kutsua varten
              this.edellinenID = id_parametrina;  

            
            },

            //poistetaan elokuva listalta
            poista: function(id_parametrina)
            {
              const poista = this.arvostelut.find( ( {id} ) => id === id_parametrina );
              poista.active = false;

              this.arvostelut = this.arvostelut.filter(function(arvostelu) {
                return arvostelu.id != id_parametrina;
              });

            }

    }
})



