/**************
 * Music Theory (Core API) - Controller - 404 Error 
 */

 export const get404 = (req, res, next) => {
  res.status(404).send('Page Not Found');
}