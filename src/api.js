import {urls} from './config.js';
import ApiUser from './api_user_store';
var apiUrl = urls.backend;
var logoutCB = null;
var refreshCallbacks = null;

export function registerLogoutCallback(_logoutCB) {
  logoutCB = _logoutCB;
}
export function registerApiUser(_user, _token, _role) { 
  new ApiUser({token: _token, role: _role});
} 

export function login(data, cb) {
  defaultPost(urls.auth_backend +"/user/login", data, cb); 
}
export function loginSocial(data, cb) {
  defaultPost(urls.auth_backend + "/user/social", data, cb);
}
export function register(data, cb) {
  defaultPost(urls.auth_backend + "/user/register", data, cb);
}
export function confirmEmail(token, cb) {
  defaultPost(urls.auth_backend + "/user/confirm", {token: token}, cb);
}
export function requestPasswordRecover(email, cb) {
  defaultPost(urls.auth_backend + "/user/password/email", {email}, cb);
}
export function checkPasswordRecoverToken(token, cb) {
  defaultGet(urls.auth_backend + "/user/password/find/" + token, cb);
}
export function sendPasswordRecover(token, password, password_confirmation, cb) {
  defaultPost(urls.auth_backend + "/user/password/reset", {token, password, password_confirmation}, cb);
}
export function getCountries(cb) {
  defaultGet(urls.auth_backend +  "/countries", cb);
}
export function uploadLayout(data, cb) {
  defaultPost("https://backcontractdev.want.cl/api/user/upload-plan", data, cb); 
}
//user_id, building_name, address, country, city, link
export function createProject(project, cb) {
  defaultPost(urls.backend + "/projects", project, cb);
}
export function getProjects(cb) {
  defaultGet(urls.backend + "/projects", cb);
}
export function calculateM2(data, cb) {
  defaultPost(urls.backend + "/m2", data, cb);
}
export function generateWorkspacesM2(data, cb) {
  defaultPost(urls.backend + "/m2/generate", data, cb);
}
export function saveGeneratedWorkspaces(data, cb) {
  defaultPost(urls.backend + "/m2/save", data, cb);
}
export function getProjectM2Data(project_id, cb) {
  defaultGet(urls.backend + "/m2/" + project_id, cb);
}
export function getProjectBuildingData(project_id, cb) {
  defaultGet(urls.backend + "/projects/"+ project_id + "/location", cb);
}
export function getSpace(id, cb) {
  defaultGet(urls.backend + "/spaces/"+ id, cb);
}
export function findBuildings(data, cb) {
  defaultPost(urls.backend + "/buildings/find", data, cb);
}
export function findBuildingsParameters(cb) {
  defaultGet(urls.backend + "/buildings/find", cb);
}
export function saveProjectFloor(project_id, building_id, floor_id, cb) {
  defaultCall(urls.backend + "/buildings/" + building_id + "/floors/" + floor_id + "/locations", "POST", {project_id}, cb);
}
export function createLayout(project_id, data, cb) {
  defaultPost(urls.backend + "/layouts/v2", data, cb);
}
export function getFinishedJob(job_id, project_id, cb) {
  defaultPost(urls.backend + "/layouts/v2/job", {job_id, project_id}, cb);
}
export function checkLayoutJobProgress(job_id, cb) {
  defaultGet(urls.backend + "/layouts/v2/job/" + job_id, cb); 
}
export function searchBuildingByName(region_name, building_name, cb) {
 defaultGet(urls.backend + "/buildings/findby/region/" + region_name + "/" + building_name, cb); 
}
export function getBuildingByZone(zone_id, cb) {
  defaultGet(urls.backend + "/buildings/findby/zone/" + zone_id, cb);
}
export function getProjectEstimatedTime(data, cb) {
  defaultPost(urls.backend + "/times", data, cb);
}
export function getProjectEstimatedTimeDetailed(data, cb) {
  defaultPost(urls.backend + "/times/detailed", data, cb);
}
export function getProjectEstimatedPrice(data, cb) {
  defaultPost(urls.backend + "/prices", data, cb);
}
export function getProjectEstimatedPriceDetail(data, cb) {
  defaultPost(urls.backend + "/prices/detail", data, cb);
}
export function getProjectPricesCategories(data, cb) {
  defaultGet(urls.backend + "/prices/create", data, cb);
}
export function saveEstimatedTime(data, cb) {
  defaultPost(urls.backend + "/times/save", data, cb);
}
export function getSavedEstimatedTime(project_id, cb) {
  defaultGet(urls.backend + "/times/saved/" + project_id, cb);
}

export function saveEstimatedPrice(data, cb) {
  defaultPost(urls.backend + "/prices/save", data, cb);
}
export function getSavedEstimatedPrice(project_id, cb) {
  defaultGet(urls.backend + "/prices/load/" + project_id, cb);
}


export function pricesExists(project_id, cb) {
  defaultGet(urls.backend + "/prices/exists/" + project_id, cb);

}
export function pricesWorkspacesExists(project_id, cb) {
  defaultGet(urls.backend + "/prices/workspaces/" + project_id, cb);
}

export function getProjectsInfo(cb) {
  defaultGet(urls.backend + "/projects/details/all", cb);
}
export function getProjectInfo(project_id, cb) {
  defaultGet(urls.backend + "/projects/details/" + project_id, cb);  
}

export function getAvailableCurrencies(cb) {
  defaultGet(urls.backend + "/prices/currencies", cb);     
}
export function getExchange(currency, cb) {
  defaultGet(urls.backend + "/prices/exchange/"+currency, cb);     
}
export function postExchange(data, cb) {
  defaultPost(urls.backend + "/prices/exchange/", data, cb);     
}
export function deleteProject(project_id, cb) {
  defaultDelete(urls.backend + "/projects/" + project_id, {}, cb);     
}
export function getLayout(project_id, cb) {
  defaultGet(urls.backend + "/layouts/v2/" + project_id, cb);     
 //(workspace + floor + etc.) según el id de proyecto. 
}
export function postLayout(project_id, data, cb) {
  defaultPost(urls.backend + "/layouts/v2/job/" + project_id, data, cb);     
}
export function putLayout(project_id, data, cb) {
  // rotation, position_x, position_y, color y alias
  defaultPut(urls.backend + "/layouts/v2/" + project_id, data, cb);     
}
export function searchBuildingByName2(region_name, building_name, cb) {
  defaultGet(urls.backend + "/buildings/findby/region/"+ region_name + "/" + building_name, cb);     
}
export function getSpacesCategories(generated_layout, cb) {
  defaultPost(urls.backend + "/spaces/categories", generated_layout, cb);     
}
export function getProjectM2ByFloor(project_id, cb) {
  defaultGet(urls.backend + "/projects/m2byfloor/" + project_id, cb);  
}



function defaultGet(url, cb) {
  	defaultCall(url, "GET", null, cb);
}
function defaultPost(url, body, cb) {
  	defaultCall(url, "POST", body, cb);
}
function defaultDelete(url, body, cb) {
    defaultCall(url, "DELETE", body, cb);
}
function defaultPut(url, body, cb) {
    defaultCall(url, "PUT", body, cb);
}
function defaultCall(url, method, body, cb) {
  var doRequest = function(url, method, body, cb) {
    let api_user = new ApiUser().get(); 
    var options = {
      method: method,
      cors: "no-cors"
    };
    if(method === "POST" || method === "PUT" ) {
      options.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + api_user.token,
        //'X-Requested-With': 'XMLHttpRequest'
      };
     // if(api_user.token) body.token = api_user.token;
      options.body = JSON.stringify(body);
    }else{
      options.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + api_user.token,
        //'X-Requested-With': 'XMLHttpRequest'
      };
    }
    fetch(url /*+ "?access_token=" + token*/, options)
    .then((response) => {
        if(response.status && response.status === 500) {
          return cb(response.json());
        }
        else if(response.status && response.status === 503) {
          return cb(response.json());
        }
        else if(response.status && (response.status === 401 || response.status === 403))   {
          logoutCB();
        } else {
          return response.json();
        }
    })
    .then((responseJson) => {
      if(cb) cb(null, responseJson);
    })
    .catch((error) => {
      if(cb) cb(error);
    });
  }
  doRequest(url, method, body, cb);
}