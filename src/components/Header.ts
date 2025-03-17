import { Center, Click, Container, Expanded, Icon, Rows, SizedBox, Text } from "../System/Lib/Widgets";

const header = Container({
    height: 50,
    color: "orange",
    child: Rows({
        children: [
            Container({
                color: "blue",
                width: 200,
                margin: 5,
                radius: 20,
                shadow: true,
                child: Center({
                    child: Text("Digital Solution", {color: "white", size: 18})
                })
            }),
            Expanded({
                child: Rows({
                    justifyContent: "center",
                    children: [
                        Container({
                            color: "white",
                            width: 400,
                            margin: 7,
                            radius: 20,
                            child: Rows({
                                alignItems: "center",
                                children: [
                                    SizedBox({ width: 10 }),
                                    Expanded(),
                                    Icon("search", {color:"black"}),
                                    SizedBox({ width: 10 })
                                ]
                            })
                        })
                    ]
                })
            }),
            ...["home", "person"].map((icon) => {
                return Click({
                    click: () => true,
                    width: 40,
                    color: "red",
                    margin: 5,
                    radius: 5,
                    shadow: true,
                    child: Center({
                        child: Icon(icon, { color:"white" })
                    }),
                });
            }),
        ]
    })
});

export default header;