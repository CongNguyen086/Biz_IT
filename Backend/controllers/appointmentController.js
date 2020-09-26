import { ResponseError } from "../models/Error";
import AppointmentService from "../services/appointmentService";
import StoreService from "../services/storeService";

const appointmentService = new AppointmentService();
const storeService = new StoreService();

export const proposeAppointment = async (req, res) => {
    try {
        const newAppointmentId = await appointmentService.createNewAppointmentInfo(req.body);
        res.status(200).json({ newAppointmentId });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getAppointmentList = async (req, res) => {
    try {
        const appointmentList = await appointmentService.getAppointmentList(req.query.userId);
        res.status(200).json(appointmentList);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const countAppointmentSelection = async (req, res) => {
    try {
        const appointmentStatistic = await appointmentService.countAppointmentSelection(req.body.appointments);
        res.status(200).json(appointmentStatistic);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getAppointmentStores = async (req, res) => {
    try {
        const stores = await storeService.getAppointmentStoresById(req.query.appointmentId);
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getAppointmentStoreDetails = async (req, res) => {
    try {
        const { appointmentId } = req.query;
        const appointmentDetails = await appointmentService.getAppointmentDetails(appointmentId);
        res.status(200).json(appointmentDetails);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const selectAppointmentOptions = async (req, res) => {
    try {
        const { appointmentId, userId, storeIds } = req.body;
        const appointmentOptions = await appointmentService.selectAppointmentStores(appointmentId, userId, storeIds);
        res.status(200).json(appointmentOptions);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const declineAppointment = async (req, res) => {
    try {
        const { appointmentId, userId } = req.body;
        const response = await appointmentService.declineAppointment(appointmentId, userId);
        typeof response !== "object"
            ? res.status(200).json({ message: "Decline successfully" })
            : res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, userId, status, storeId } = req.body;
        const response = await appointmentService.updateAppointmentStatus(appointmentId, userId, status, storeId);
        typeof response !== "object"
            ? res.status(200).json({ message: "Update successfully" })
            : res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}