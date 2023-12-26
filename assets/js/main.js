navigator.geolocation.getCurrentPosition(
    // if succesed 
    (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    // if blocked 
    () => getWeatherByIp()
);
const arrow = document.getElementById('arrow')
const header = document.getElementById('header')
const main = document.getElementById('main')
const error = document.getElementById('error')
const city = document.getElementById('city')
const select = document.getElementById('select')
const input = document.getElementById('input')
const errorInfo = document.getElementById('errorInfo')
const changeCity = document.getElementById('changeCity')
const tryButton = document.getElementById('tryButton')
let isClicked = false

async function getWeatherByCoords(lat, lon){
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=5ea900c9b61899b3040affe4180c998c&units=metric`)
    weather.json().then((data) => {
        drawData(data, data.name)
    });
}

async function getWeatherByIp(){
    let ip_obj = await fetch('https://api64.ipify.org?format=json')
    .then(data => data.json())
    
    let city = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_WWsVFcu0II13ublEo1H8WS97FQfvf&ipAddress=${ip_obj.ip}`)
    .then(data => data.json())
   
    let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.location.city}&appid=5ea900c9b61899b3040affe4180c998c&units=metric`)

    weather.json().then((data) => {
      console.log(data)
      if (data.cod != 200) {
        dropError()
      } else {
        drawData(data, data.name)
      }
    });
}

async function getWeatherBySelectCity(loc) {
let weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=5ea900c9b61899b3040affe4180c998c&units=metric`)

    weather.json().then((data) => {
      if (data.cod != 200) {
        dropError(data.message)
      } else {
        drawData(data, data.name)
        header.style.display = 'flex'
        main.style.display = 'flex'
        arrow.style.display = 'none'
        isClicked = false
        city.style.display = 'none'
      }
    })
}
function drawData(data, city) {
  const deg = document.getElementById('deg')
 const img = document.getElementById('img')
 const location = document.getElementById('location')
 const desc = document.getElementById('desc')
 const feelsLike = document.getElementById('feelsLike')
 const wind = document.getElementById('wind')
 const pressure = document.getElementById('pressure')
 const clouds = document.getElementById('clouds')
 const visibility = document.getElementById('visibility')
 const sunrise = document.getElementById('sunrise')
 const sunset = document.getElementById('sunset')
 
 location.textContent = city
 deg.textContent = Math.round(data.main.temp)
 img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
 desc.textContent = data.weather[0].main
 feelsLike.textContent = Math.round(data.main.feels_like) + ' °C'
 wind.textContent = data.wind.speed + ' m/s'
 pressure.textContent = data.main.pressure
 clouds.textContent = data.clouds.all
 visibility.textContent = data.visibility
 
 let sunriseDate = new Date(data.sys.sunrise * 1000)
 let sunsetDate = new Date(data.sys.sunset * 1000)
 sunrise.textContent = ((sunriseDate.getHours() >= 10) ? sunriseDate.getHours() : '0' + sunriseDate.getHours()) + ':' + ((sunriseDate.getMinutes() >= 10) ? sunriseDate.getMinutes() : '0' + sunriseDate.getMinutes())
 sunset.textContent = sunsetDate.getHours() + ':' + sunsetDate.getMinutes()
}

changeCity.addEventListener('click', (ev) => {
  header.style.display = 'none'
  main.style.display = 'none'
  arrow.style.display = 'block'
  city.style.display = 'flex'
  isClicked = true
})

arrow.addEventListener('click', (ev) => {
  if (isClicked) {
    header.style.display = 'flex'
    main.style.display = 'flex'
    arrow.style.display = 'none'
    city.style.display = 'none'
    isClicked = false
  }
})

select.addEventListener('click', (ev) => {
  if (input.value != '') {
    getWeatherBySelectCity(input.value)
    input.value = ''
  } else {
    dropError("input field is empty")
  }
})

tryButton.addEventListener('click', (ev) => {
  arrow.style.display = 'block'
  city.style.display = 'flex'
  error.style.display = 'none'
})

function dropError(info){
  errorInfo.textContent = info
  arrow.style.display = 'none'
  city.style.display = 'none'
  error.style.display = 'flex'
}