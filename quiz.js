function getData(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}
getData('GET', 'https://opentdb.com/api.php?amount=10').then(function (data) {
    let parsedData = JSON.parse(data);
    console.log(parsedData);
    let output = '';
    for (let i of parsedData.results) {
        output += `<li>
                    <h3>Question: ${i.question}</h3>
                    <p>${i.correct_answer}</p>
                    <p>${i.incorrect_answers}</p>
                  </li>`;
    }
    document.querySelector('.container').innerHTML = output;
    console.log(output);
}).catch(function (err) {
    console.log(err);
});