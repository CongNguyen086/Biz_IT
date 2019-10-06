import pandas as pd

transactions = pd.read_csv('./transactions.csv')

favourite = transactions['service_id'].value_counts().index[1:11].tolist()
output = pd.DataFrame(favourite, columns =['best'])
output.to_csv('favourite.csv', index = False)
