
$(document).ready(function () {

    $(window).load(function () {
        // Animate loader off screen
        $(".se-pre-con").fadeOut(2000);;

    });
});

var currentDate = new Date();
var currentMonth = currentDate.getMonth() - 1;

const getNews1 = async () => {

    const url = "https://gnews.io/api/v4/search?q=movie&q=movies&q=film&q=trailer&q=netflix&from=" + currentMonth + "&sortBy=publishedAt&token=ba321b37abc7a5d974194335c54ceef8&lang=en";
    const res = await fetch(url);
    const { articles } = await res.json();
    return articles;
};

const createNewsItemEl = ({ description, title, url, image }) => {
    const d = document.createElement("div");
    d.innerHTML = `
            <div class='newDiv'>
            <div class='newImg'><img src="${image}" style="width:300px; height:auto" /> </div>    
            <div class='newDescription'>
            <div class='newUrl'><a href="${url}" target="_blank" ><h5>${title}</h5></a></div>
               <p>${description}</p></div></div>
            
            <hr class="solid"></div>
                `
        ;
    return d;
};

getNews1().then((news) => {
    console.log(news)

    const cont = document.getElementById("news");
    for (const news_item of news) {
        cont.appendChild(createNewsItemEl(news_item));

    }
}).catch(console.error);

