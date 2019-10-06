

#Import neccessary libraries
import pandas as pd
import numpy as np
import time
import turicreate as tc
from sklearn.model_selection import train_test_split

#Read data
# merchants = pd.read_csv('https://raw.githubusercontent.com/quynhdinh/recommender/master/data/merchants.csv?token=AI6DJC2RGXQVRTMT2HBCG725STPUC')
transactions = pd.read_csv('transactions.csv')


transactions['service_id'] = transactions['service_id'].astype(str)
# merchants['service_id'] = merchants['service_id'].astype(str)

trans = transactions[['user_id', 'service_id']]


#Now group service_id of people. Now ['user_id'] are all unique
trans = trans.groupby('user_id')['service_id'].apply(list).reset_index(name = 'service_ids')



data = pd.melt(trans.set_index('user_id')['service_ids'].apply(pd.Series).reset_index(), 
             id_vars=['user_id'],
             value_name='service_id') \
    .dropna().drop(['variable'], axis=1) \
    .groupby(['user_id', 'service_id']) \
    .agg({'service_id': 'count'}) \
    .rename(columns={'service_id': 'purchase_count'}) \
    .reset_index() \
    .rename(columns={'serviceIds': 'serviceId'})
data['service_id'] = data['service_id'].astype(str)
data['user_id'] = data['user_id'].astype(str)


def create_data_dummy(data):
    data_dummy = data.copy()
    data_dummy['purchase_dummy'] = 1
    return data_dummy

data_dummy = create_data_dummy(data)
data_dummy.tail(10)


user_id = 'user_id'
item_id = 'service_id'
users_to_recommend = list(trans[user_id])
n_rec = 10 # number of items to recommend
n_display = 30 


users_to_recommend = list(trans[user_id])

final_model = tc.item_similarity_recommender.create(tc.SFrame(data_dummy), 
                                            user_id=user_id, 
                                            item_id=item_id, 
                                            target='purchase_dummy', 
                                            similarity_type='cosine')

recom = final_model.recommend(users=users_to_recommend, k=n_rec)
recom.print_rows(n_display)


df_rec = recom.to_dataframe()



df_output = df_rec[['user_id', 'service_id','rank']]


df_temp = df_output
# df_temp['user_id'] = df_temp['user_id'].apply(lambda x : ',' + x)
# df_temp['service_id'] = df_temp['service_id'].apply(lambda x: ',' + x)
# df_temp['rank'] = df_temp['service_id'].apply(lambda x: ',' + x)
df_temp.to_csv('output.csv', index=False)