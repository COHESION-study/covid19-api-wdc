# Setting up a Web Data Conector for Tableau

Use this WDC to access [Canadian COVID-19](https://opencovid.ca/api/) data from Tableau. Complete docs available [here](https://tableau.github.io/webdataconnector).

_NB_ Tableau Online does not allow WDC to be refreshed automatically. It needs to be refreshed manually through Tableau Desktop. This means we will probably have to move the WDC functionalities out of Tableau and have the data dumped into the CC pg database to which Tableau is connected. 
