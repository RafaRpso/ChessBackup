#!/bin/bash




request_archives(){
	REQUEST="https://api.chess.com/pub/player/${NICK}/games/archives"
	RESPONSE=$(curl $REQUEST)
	
	echo $RESPONSE
}

request_games_for_month(){
	ARCHIVES_JSON="$1"
	ARCHIVES_ARRAY=($(echo $ARCHIVES_JSON | jq -r '.archives[]'  ))
	echo "${ARCHIVES_ARRAY[@]}"
	for month in "${ARCHIVES_ARRAY[@]}"; do
		echo $month
		request_month_games $month

	done
}

request_month_games(){
	REQUEST_URL="$1"
	RESPONSE=$(curl $REQUEST_URL)
	ALL_GAMES_MONTH_ARRAY=($(echo "$RESPONSE" | jq -r '.games[]'))
	ARR_LENGHT=${#ALL_GAMES_MONTH_ARRAY[@]}
	
	
	for((i=0;i<$ARR_LENGHT;i++)) do
		DATE_TIMESTAMP=$(echo $RESPONSE | jq -r ".games[$i].end_time")
		if [ "$DATE_TIMESTAMP" != "null" ]; then 
			DATE=$(echo $(date -d "@$DATE_TIMESTAMP" +"%d_%b_%Y_%H:%M:%S "))	
			MONTH_YEAR=$(echo $(date -d "@$DATE_TIMESTAMP" +"%b_%Y"))
			PGN=$(echo $RESPONSE | jq -r ".games[$i].pgn")
			create_dir_and_config_files $i "$DATE" "$PGN" "$MONTH_YEAR"
		else
			break 
		fi 	
	done
}

create_dir_and_config_files(){
	GAME_NUMBER="$1"
	GAME_DATE="$2"
	PGN="$3"
	MONTH_YEAR="$4"
	FILENAME="chess_bkp $GAME_DATE.txt"
	if !  test -d "./Chess_Backup" ; then
		mkdir Chess_Backup
		create_dir_and_config_files "$GAME_NUMBER" "$GAME_DATE" "$PGN" "$MONTH_YEAR"
	else

		create_month_dir "$MONTH_YEAR" "$PGN" "$FILENAME"
	fi 
}

create_month_dir(){
	MONTH_YEAR="$1"
	PGN="$2"
	FILENAME="$3"
	PATH_CHESS="./Chess_Backup/$MONTH_YEAR"


	if test -d "$PATH_CHESS"; then
			
		echo "CRIANDO ARQUIVO... $PATH_CHESS/$FILENAME"
		echo "$PGN" > "$PATH_CHESS/$FILENAME"
	else
		mkdir $PATH_CHESS
	       create_month_dir "$MONTH_YEAR" "$PGN" "$FILENAME"
	fi 
}


main(){
	if test -d "./Chess_Backup"; then 
		rm -rfv ./Chess_Backup
		rm -rfv ./Chess_Backup.zip
	fi 

	ARCHIVES=$(request_archives)
	request_games_for_month $ARCHIVES

}


if [ -n "$1" ] ; then
	declare -g NICK="$1"
	main 
else
	echo "Forneça um nick: Chame o programa com ./main.sh <nickname>"
fi 	
