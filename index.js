
const result = document.getElementById("result");
const flairs = document.getElementById("flairs");
const subreddit_name = document.getElementById("subreddit-name");
let selected_flairs = []

for (let preset_subreddit_name of document.getElementsByClassName("preset-subreddit-name")) {
    preset_subreddit_name.addEventListener("click",()=>{
        subreddit_name.value = preset_subreddit_name.innerText;
    });
}


const inputEnter = (event) => {
    if (event.key === 'Enter') {
        inputButton()
    }
}

const inputButton = ()=>{
    if (subreddit_name.value==""){
        result.innerText = "Please enter the subreddit name!";
    }
    else {
        scrape(subreddit_name.value);
    }
}

const scrape = (subreddit_name) => {
    selected_flairs = []
    let url = "";
    // get the data
    const getBy = document.getElementById("get-by").value;
    const limit = document.getElementById("limit").value;

    // form urul
    // result.innerText = `'${subreddit_name}' get by '${getBy}' limit '${limit}'`
    url = `https://www.reddit.com/r/${subreddit_name}/${getBy}.json?limit=${limit}`;


    // get the result
    try {
        fetch(url).then(response=>{
            // console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        }).then((response)=>{
            // result.innerText += url+"\n";
            // result.innerText += response["data"]["children"][0]["data"]["title"];
            // console.log(response["data"]["children"])
            
            //currently limit cap at 100, but response["data"] got after token, so next request can be
            // Eg. https://www.reddit.com/r/{subreddit}/top.json?limit=100&after=t3_abcdefgh
            formatPost(response["data"]["children"])
        }).catch(err=> {
            result.innerText = "Request Error: " + err.message;
        })
    
    }
    catch(err) {
        result.innerText = "Unknown Error: " + err.message;
    }
    // return result
}

const formatPost = (response) => {
    flairs.innerText = ""; //clear previous results
    result.innerText = ""; //clear previous results
    
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
    let flairs_list = []
    for (let data of response) {
        data = data["data"]
        const tr_data = document.createElement("tr");
        let title = data["title"];
        let title_data = document.createElement("td");
        title_data.innerText = title;
        title_data.classList.add("title-cell");
        tr_data.appendChild(title_data);

        // format markdown to HTML
        let post = data["selftext"];
        let post_data = document.createElement("td");
        let post_div = document.createElement("div");
        post_div.innerHTML = marked.parse(post);
        post_div.classList.add("post-cell");
        post_data.appendChild(post_div);
        post_data.classList.add("post-cell");
        tr_data.appendChild(post_data);

        let author = data["author"];
        let author_data = document.createElement("td");
        let author_a = document.createElement("a");
        author_a.setAttribute("href",`https://www.reddit.com/user/${author}/`);
        author_a.setAttribute("target","blank");
        author_a.innerText = author;
        author_data.appendChild(author_a);
        author_data.classList.add("author-cell");
        tr_data.appendChild(author_data);

        let flair = data["link_flair_text"];
        let flair_data = document.createElement("td");
        flair_data.innerText = flair;
        if (!flairs_list.includes(flair)) {
            if (flair) {
                flairs_list.push(flair)
            }
            else {
                if (!flairs_list.includes("--empty--"))
                flairs_list.push("--empty--")
            }
        }
        flair_data.classList.add("flair-cell");
        tr_data.appendChild(flair_data);

        let url = data["url"];
        let url_data = document.createElement("td");
        let url_a = document.createElement("a");
        url_a.setAttribute("href",url);
        url_a.setAttribute("target","blank");
        url_a.innerText = url;
        url_data.appendChild(url_a);
        url_data.classList.add("url-cell");
        tr_data.appendChild(url_data);

        let time = data["created_utc"];
        let time_data = document.createElement("td");
        time_data.innerText = new Date(time*1000).toLocaleString();
        time_data.classList.add("time-cell");
        tr_data.appendChild(time_data);

        table.appendChild(tr_data);
    }
    result.appendChild(table);

    for (let flair of flairs_list) {
        const flair_button = document.createElement("sl-badge");
        flair_button.addEventListener("click",()=>{
            flairSelected(flair_button);
        })
        flair_button.setAttribute("pill","true");
        flair_button.setAttribute("variant","neutral");
        flair_button.innerText = flair;
        flairs.appendChild(flair_button);
    }
}

const toggleTable = () => {
    // find flairs by class 'flair-cell' 
    const post_flairs = document.getElementsByClassName("flair-cell");
    for (let post_flair of post_flairs) {
        if (selected_flairs.length) { //when there is some flair selected
            if (post_flair.innerText == "") { //empty flair
                if(selected_flairs.includes("--empty--")) {
                    console.log("here")
                    post_flair.parentElement.style.display = "";
                    post_flair.parentElement.style.visibility = "visible";
                }
                else {
                    post_flair.parentElement.style.display = "none";
                    post_flair.parentElement.style.visibility = "hidden";
                }
            }
            else if (selected_flairs.includes(post_flair.innerText)) {
                post_flair.parentElement.style.display = "";
                post_flair.parentElement.style.visibility = "visible";
            }
            else {
                post_flair.parentElement.style.display = "none";
                post_flair.parentElement.style.visibility = "hidden";
            }
        }
        else { //no flair selected, show everything
            post_flair.parentElement.style.display = "";
            post_flair.parentElement.style.visibility = "visible";
        }
    }
}

const flairSelected = (flair_button) => {

    const flair_text = flair_button.innerText;
    if (flair_button.getAttribute("variant") == "neutral") {
        flair_button.setAttribute("variant","success"); //filter 
        if (!selected_flairs.includes(flair_text)) {
            selected_flairs.push(flair_text);
        }

    }
    else {
        flair_button.setAttribute("variant","neutral"); //unfilter
        if (selected_flairs.includes(flair_text)) {

            var index = selected_flairs.indexOf(flair_text);
            if (index !== -1) {
                selected_flairs.splice(index, 1);
            }
        }
    }
    // console.log("flair_text",flair_text)
    // console.log("selected_flairs",selected_flairs)

    toggleTable();
}

const saveTable = () => {
    // get the table
    const table = document.getElementsByTagName("table");
    // console.log(table);
    if (table.length) {
        const wb = XLSX.utils.table_to_book(table[0], { sheet: "Sheet 1" });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `subreddit_scraper_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);
    }
    else {
        result.innerText = "No data to save!";
    }
}