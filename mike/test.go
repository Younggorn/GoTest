package mike

import (
	"fmt" // ปริ้น,แสดงผล console
	"github.com/google/uuid"
	//"github.com/mikelopster/go-example/mike" //ชื่อโฟลเดอร์
) 

func Gorn(){
	id := uuid.New()
	fmt.Print("Hello World\n")
	fmt.Printf("UUID: %s \n" ,id)
	//mike.SayMikelopster()

}