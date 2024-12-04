
const form = document.getElementById("form");

const inputEnter = (event) => {
    if (event.key === 'Enter') {
        inputButton()
    }
}

const inputButton = ()=>{
    const subreddit_name = document.getElementById("subreddit-name");

    const result = document.getElementById("result");
    if (subreddit_name.value==""){
        result.innerText = "Please enter the subreddit name!";
    }
    else {
        scrape(subreddit_name.value);
    }
}

const scrape = (subreddit_name) => {
    result.innerText = ""; //clear previous results

    let url = "";
    // get the data
    const getBy = document.getElementById("get-by").value;
    const limit = document.getElementById("limit").value;

    // form urul
    // result.innerText = `'${subreddit_name}' get by '${getBy}' limit '${limit}'`
    url = `https://www.reddit.com/r/${subreddit_name}/${getBy}.json?limit=${limit}`;


    // get the result
    fetch(url).then(response=>response.json()).then((response)=>{
        // result.innerText += url+"\n";
        // result.innerText += response["data"]["children"][0]["data"]["title"];
        // console.log(response["data"])
        
        //currently limit cap at 100, but response["data"] got after token, so next request can be
        // Eg. https://www.reddit.com/r/{subreddit}/top.json?limit=100&after=t3_abcdefgh
        formatPost(response["data"]["children"])
    })

    // return result
}

const formatPost = (response) => {
    
    // put the data in table view
    // title, selftext, author, link_flair_text, url, created_utc
    const table = document.createElement("table");
    const headings = ["title","post","author","flair","link","time"]
    const tr_heading = document.createElement("tr");
    for (let h of headings) {
        const h_elem = document.createElement("th");
        h_elem.innerText = h
        tr_heading.appendChild(h_elem)
    }
    table.appendChild(tr_heading)
    for (let data of response) {
        data = data["data"]
        const tr_data = document.createElement("tr");
        let title = data["title"];
        let title_data = document.createElement("td");
        title_data.innerText = title;
        tr_data.appendChild(title_data);

        let post = data["selftext"];
        let post_data = document.createElement("td");
        post_data.innerText = post;
        tr_data.appendChild(post_data);

        let author = data["author"];
        let author_data = document.createElement("td");
        let author_a = document.createElement("a");
        author_a.setAttribute("href",`https://www.reddit.com/user/${author}/`);
        author_a.innerText = author;
        author_data.appendChild(author_a);
        tr_data.appendChild(author_data);

        let flair = data["link_flair_text"];
        let flair_data = document.createElement("td");
        flair_data.innerText = flair;
        tr_data.appendChild(flair_data);

        let url = data["url"];
        let url_data = document.createElement("td");
        let url_a = document.createElement("a");
        url_a.setAttribute("href",url);
        url_a.innerText = url;
        url_data.appendChild(url_a);
        tr_data.appendChild(url_data);

        let time = data["created_utc"];
        let time_data = document.createElement("td");
        time_data.innerText = time;
        tr_data.appendChild(time_data);

        table.appendChild(tr_data);
    }
    result.appendChild(table);
}