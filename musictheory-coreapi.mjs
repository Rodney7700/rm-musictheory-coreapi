/**************
 * Music Theory (Core API) - Application 
 */

// NodeJS Core Modules
import Path from 'path';
import URL from 'url';
import CORS from 'cors';
const __dirname = Path.dirname(URL.fileURLToPath(import.meta.url));

// Third Party Modules
import Express from 'express';

// Keys Routes
import * as keyFunctionsRoutes from './routes/keyfunctions.mjs';

// Intervals Routes
import * as intervalFunctionsRoutes from './routes/intervalfunctions.mjs';

// Chords Routes
import * as chordFunctionsRoutes from './routes/chordfunctions.mjs';

// Scales Routes
import * as scaleFunctionsRoutes from './routes/scalefunctions.mjs';

// Home Routes
import * as homeRoutes from './routes/home.mjs';

// Error Controller
import * as errorController from './controllers/error404.mjs';

// Application
const musicTheoryServer = Express();

musicTheoryServer.set('view engine', 'ejs');
musicTheoryServer.set('views', 'views');

musicTheoryServer.use(Express.urlencoded({extended: true})); // For parsing html requests 

let corsOptions = {
  'origin': '*',
  'methods': [ 'GET', 'POST' ],
  'allowedHeaders': [ 'Content-Type', 'Authorization' ], 
  'preflightContinue': false,
  'optionsSuccessStatus': 204
};
// This will apply the above CORS options on all routes
musicTheoryServer.use(CORS(corsOptions));

// This will automatically parse any REQUEST body containing JSON data on all routes
musicTheoryServer.use(Express.json({
  inflate: true,
  limit: '100kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
}));

// Keys
musicTheoryServer.use(keyFunctionsRoutes.routes);

// Intervals
musicTheoryServer.use(intervalFunctionsRoutes.routes);

// Chords
musicTheoryServer.use(chordFunctionsRoutes.routes);

// Scales
musicTheoryServer.use(scaleFunctionsRoutes.routes);

// Home
musicTheoryServer.use(homeRoutes.routes);

// Error
musicTheoryServer.use(errorController.get404);

// Start Application
musicTheoryServer.listen(8080);