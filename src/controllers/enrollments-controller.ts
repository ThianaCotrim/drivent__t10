import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import enrollmentsService from '@/services/enrollments-service';

export async function getEnrollmentByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const enrollmentWithAddress = await enrollmentsService.getOneWithAddressByUserId(userId);

    return res.status(httpStatus.OK).send(enrollmentWithAddress);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function postCreateOrUpdateEnrollment(req: AuthenticatedRequest, res: Response) {
  try {
    await enrollmentsService.createOrUpdateEnrollmentWithAddress({
      ...req.body,
      userId: req.userId,
    });

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

// TODO - Receber o CEP do usuário por query params.
export async function getAddressFromCEP(req: AuthenticatedRequest, res: Response) {
  try {
    const cep = req.query.cep as string;

    if (!cep) {
      return res.status(httpStatus.BAD_REQUEST).send('CEP não fornecido');
    }

    try {
      const address = await enrollmentsService.getAddressFromCEP(cep);
      res.status(httpStatus.OK).send(address);
    } catch (error) {
      if (error.message === 'CEP inválido') {
        return res.status(httpStatus.BAD_REQUEST).send('CEP inválido');
      }

      if (error.name === 'NotFoundError') {
        return res.send(httpStatus.NO_CONTENT);
      }

      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
