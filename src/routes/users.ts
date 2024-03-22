import {Router} from 'express'
import { errorHandler } from '../error-handler'
import authMiddleware from '../middlewares/auth'
import {  listUsers } from '../controllers/users'
import adminMiddleware from '../middlewares/admin'

const usersRoutes:Router = Router()

usersRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))

export default usersRoutes