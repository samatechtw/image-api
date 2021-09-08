import authService from "./service/authService";
import imageService from "./service/imageService";

let run = async ()=> {
  await authService.init()
  await imageService.init()
}

run()
