import pandas as pd

transactions = pd.read_csv('./data/transactions.csv')

favourite = transactions['service_id'].value_counts().index[1:11].tolist()
output = pd.DataFrame(favourite, columns =['best'])
output.to_csv('./output/favourite.csv', index = False)
