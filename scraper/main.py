# Importing other files with their modules
import scraper
import database
from datetime import datetime
from time import sleep

if __name__ == '__main__':
    # File name of the json File to which the scraped data will be saved in a first step
    file_name = "scraped_data_1000"
    
    while True:
        if datetime.now().minute == 7:
            try:
                print(scraper.time_now(), "Scraper successfully started, new crypto data is being scraped.")
                
                # The scrape method of scraper gets called to scrape the crypto data from coinmarketcap
                scraper.scrape(file_name, show_browser=0)
                
                print(scraper.time_now(), "Scraper successfully scraped all new crypto data and saved it to ", file_name)
                print(scraper.time_now(), "Starting to save scraped data to the MongoDB database.")

                # The scraped data gets loaded from the json file and saved to the MongoDB database
                database.save_data_to_db(file_name)

                print(scraper.time_now(), "Successfully saved scraped data to the MongoDB database.")
            except:
                print(scraper.time_now(), "!!! An error occurred, trying again in 1 hour !!!")
        else:
            sleep(50)