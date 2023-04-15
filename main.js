//AXIOS GLOBAL
/*
In the Axios library, the globals object is used to define default configurations
 for all requests. These defaults are applied to every request made using the Axios instance,
 unless the individual request configuration overrides them.

Setting default headers: You can set headers that should be included in every request, such as an authorization token or content type.

Setting a base URL: If you're making requests to a specific API endpoint, you can set the base URL in the globals object so that you don't have to include it in every request.
axios.defaults.baseURL = 'https://api.example.com/';

Setting a timeout: You can set a default timeout value for all requests, so that you don't have to specify it in each individual request.
*/
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
// GET REQUEST
//Long way
// function getTodos() {
//   axios({
//     method:'get',
//     url:'https://jsonplaceholder.typicode.com/todos',
//     //paramters for url
//     params:{
//       _limit:5
//     }
//   })
//can also write url as https://jsonplaceholder.typicode.com/todos?_limit=5
//   //status:successful and 200 is the number of data
//   //we passed an object to axios method and it will return a promis
//   .then((res)=>console.log(res.data))
//   .catch((e)=> console.error(e));
// }

//Short way
//it will work even without writing get explicitly
function getTodos(){
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{timeout:5000})
  .then((res)=>showOutput(res))
  .catch((e)=>console.error(e))
}

// function addTodo() {
//   axios({
//     method:'post',
//     url:'https://jsonplaceholder.typicode.com/todos',
//     data{
  //  title:'new todo,
  //  completed:false
  //
      //}
//   })
// POST REQUEST
function addTodo() {
  axios.post('https://jsonplaceholder.typicode.com/todos',{
    title:'New Todo',
    completed:false
    }
  ).then((res)=>showOutput(res))
  .catch((e)=>console.error(e))
}
/*
put- it is meant to replace the entire resourse(doesnt show user id)
patch- update incremently (will show user id)
*/ 
// PUT/PATCH REQUEST--Note: we have to add id in the end of the url
function updateTodo() {
  axios.patch('https://jsonplaceholder.typicode.com/todos/1',{
    title:'New Todo',
    completed:false
    }
  ).then((res)=>showOutput(res))
  .catch((e)=>console.error(e))
}

// DELETE REQUEST--Note: we have to add id in the end of the url
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/todos/1'
  ).then((res)=>showOutput(res))
  .catch((e)=>console.error(e))
}

// SIMULTANEOUS DATA
/*
we can do simultanaeous request using azios.all as well

function getData() {
  axios.all([axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')])
.then((res) =>{
  console.log(res[0]);
  console.log(res[1]);
  showOutput(res[1]);
}).catch((e)=>console.log(e))
}
*/
//spread takes a function as a parameter
function getData() {  
  axios.all([axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
  axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')])
  .then(axios.spread((todos, posts) =>{
      console.log(todos);
      showOutput(posts);
  }))
  .catch((e) => console.error(e));
}

// CUSTOM HEADERS
//e.g, can be used for authentication token for login to do something
function customHeaders() {
  const config={
    headers:{
      'Content-Type':'application/json',//because data type is json
      Authorization:'some token'
    }
  };
  axios.post('https://jsonplaceholder.typicode.com/todos',{
    title:'New Todo',
    completed:false
    },
    config
  ).then((res)=>showOutput(res))
  .catch((e)=>console.error(e))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options={
    method:'post',
    url:'https://jsonplaceholder.typicode.com/todos',
    data:{
      title:'hello world'
    },
    transformResponse: axios.defaults.transformResponse.concat(data =>{
      data.title=data.title.toUpperCase();
      return data;
    })
  };
  axios(options).then(res => showOutput(res));
  
}

// ERROR HANDLING
function errorHandling() {
  axios.get('https://jsonplaceholder.typicode.com/todssos',{
    // validateStatus:function(status){
    //   return status<500;//rejects if the status is greater than or equal to 500
    // }
  })
  .then(res => showOutput(res))
  .catch((err)=>{
    if(err.response){
      //server responded with an error other than in the range of 200
      console.log(err.response.data);
      console.log(err.response.status)
      console.log(err.response.header);
      if(err.response.status===404) alert ('Error: Page Not Found');
    }else if(err.request){
      //re==Request was made but no response
      console.log(err.request.status)
    }else{
      console.log(err.message);
    }
  })
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios.get('https://jsonplaceholder.typicode.com/todos',{
    cancelTokens:source.token
  })
  .then(res=>showOutput(res))
  .catch((thrown)=>{
    if(axios.isCancel(thrown)){
      console.log('Request cancelled',thrown.message);
    }
  });
  if(true){
    source.cancel('Request cancelled!');
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(
  config =>{
    console.log(`${config.method.toUpperCase()} request sent to ${config.url}
    at ${new Date().getTime()}`);
    return config;
  },error =>{
    return Promise.reject(error)
  }
);

// AXIOS INSTANCES
/*
const axiosInstance = axios.create({
  baseURL:'https://jsonplaceholder.typicode.com'
});
axiosInstance.get('/comments?_limit=5').then(res => showOutput(res));*/

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
