import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

export default StyleSheet.create({
  safeView: {
    backgroundColor: Colors.bgColor,
    flex: 1,
  },
  container: {
    paddingHorizontal: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  storeList: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  eventNameText: {
    fontSize: 20,
    fontWeight: '700',
  },
  eventHost: {
    fontStyle: 'italic',
    fontWeight: '600',
    fontSize: 18,
    color: '#4E5A69',
  },
  storeIndex: {
    color: Colors.completed,
    fontWeight: '600',
    fontSize: 16,
  },
  storeImage: {
    width: '20%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetail: {
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    flexDirection: 'row',
    alignItems : 'center',
    marginTop: 5,
  },
  description: {
    marginTop: 10,
  },
  removeItemButton: {
    paddingHorizontal: 5,
  },
  extraText: {
    paddingHorizontal: 6,
  },
  categoryName: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.extraText,
  },
  selectButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  rightElement: {
    // width: '20%',
    minWidth: 50,
    justifyContent: 'flex-start',
    height: '100%',
    alignItems: 'flex-end'
  },
  selectedText: {
    marginBottom: 10,
    color: Colors.extraText,
    fontWeight: '400'
  },
  meetingDateBox: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  meetingDateTitle: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
    minWidth: 100,
  },
  meetingDateText: {
    color: Colors.extraText,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
  },
  bottomButton: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13,
    flex: 1,
    backgroundColor: Colors.primary,
  },
  bottomButtonText: {
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
  bottomButtonDisabled: {
    opacity: 0.7,
  },
  buttonCancel: {
    backgroundColor: '#EB5757'
  },
  membersList: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
  memberItem: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  statusCol: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  memberNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
  },
  canceledAppointmentText: {
    // fontStyle: 'italic',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500'
  },
  modalWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
  },
  buttonCancelModal: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonCancelModalText: {
    color: Colors.secondary
  },
  modalDetailSelectedText: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.extraText,
    marginTop: 20,
  },
  modalDetailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  }
})