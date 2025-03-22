import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Button, Center, Checkbox, Click, Column, Confirm, Container, Expanded, Icon, Prompt, Root, Rows, SingleChildScrollView, Space, Switch, Text, TextField } from "../System/Lib/Widgets";
import { useEffect, useRef, useState } from "react";
import { setTheme } from "../store/sliceThemes";

export default function Sample() {
  const { colors } = useSelector((state: RootState) => state.theme);
  const [checked, setChecked] = useState(colors.mode == "dark");
  const dispatch = useDispatch();
  const ref = useRef(null);
  const refBody: { [key: string]: any } = {};
  const stateCheck: { [key: string]: any } = {};
  const [width, setWidth] = useState(300);

  return Root({
    theme: colors,
    child: Container({
      color: "theme.background",
      child: Rows({
        children: [
          Container({
            width: width,
            borderRight: "1px solid theme.border",
            child: Column({
              children: [
                Expanded({ child: SideBar(width) }),
                Container({
                  borderTop: "1px solid theme.border",
                  child: Rows({
                    children: [
                      width !== 300 ? null : Space(10),
                      width !== 300 ? null : Switch({
                        checked,
                        label: !checked ? "Light Mode" : "Dark Mode",
                        onChange: (e: any) => {
                          setChecked(e.target.checked);
                          dispatch(setTheme(!checked ? "dark" : "light"))
                        }
                      }),
                      Expanded(),
                      Click({
                        click: () => {
                          setWidth(width == 300 ? 60 : 300);
                        },
                        width: width !== 300 ? 60 : 30,
                        height: 30,
                        radius: 30,
                        margin: 8,
                        child: Center({
                          child: Icon(width !== 300 ? "arrow_circle_right" : "arrow_circle_left")
                        })
                      })
                    ]
                  })
                }),
              ]
            })
          }),
          Expanded({
            child: Table(ref, refBody, stateCheck)
          })
        ]
      })
    })
  }).builder();
}

function SideBar(width: number) {

  return Column({
    children: [
      Container({
        height: 60,
        borderBottom: "1px solid theme.border",
        child: Center({ child: Text(width == 300 ? "Logo Applikasi" : "L", { size: 20 }) })
      }),
      width !== 300 ? null : Container({
        height: 60,
        borderBottom: "1px solid theme.border",
        child: Container({
          padding: 10,
          child: TextField({
            placeholder: "Search menu ...",
            endIcon: Icon("search"),
          })
        })
      }),
    ]
  });
}

function Table(ref: any, refBody: any, stateCheck: any) {
  return Container({
    child: Column({
      children: [
        Toolbar(stateCheck),
        Header(ref, refBody, stateCheck),
        Body(ref, refBody, stateCheck),
        Footer(),
        Pagination(),
      ]
    }),
  });
}

function Toolbar(stateCheck: any = []) {
  const { colors } = useSelector((state: RootState) => state.theme);
  const [focus, setFocus] = useState(false);
  const [isSelectOne, setIsSelectOne] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const selectOne = Object.values(stateCheck).filter((x: any) => x.refc).length == 1;
    setIsSelectOne(selectOne);
  }, [stateCheck]);

  return Container({
    height: 60,
    borderBottom: "1px solid theme.border",
    child: Rows({
      alignItems: "center",
      children: [
        Container({
          width: 60,
          child: Center({
            child: Icon("refresh", {
              onClick: () => {
                console.log("refresh");
              }
            })
          })
        }),
        Button("Add Data", { icon: "add", height: 35 }),
        Space(10),
        !isSelectOne ? null : Button("Edit Data", { icon: "edit", height: 35 }),
        Space(10),
        !isSelectOne ? null : Button("Delete Data", {
          icon: "edit", height: 35, backgroundColor: "theme.error",
          onClick: () => {
            Confirm({
              theme: colors,
              title: "Confirmation",
              message: "Are you sure you want to delete it?",
              onAccept: (accept: any) => {
                console.log("delete", accept);
              }
            })
          }
        }),
        Expanded(),
        Container({
          width: focus ? 400 : 200,
          transition: !focus ? "unset" : "0.3s width ease-in-out",
          child: Center({
            child: TextField({
              placeholder: "Search ...",
              endIcon: Icon( search.length ? "close" :"search", {
                cursor: "pointer",
                onClick: () => setSearch("")
              }),
              value: search,
              onFocus: () => setFocus(true),
              onBlur: () => setFocus(false),
              onChange: (e: any) => setSearch(e.target.value),
            })
          })
        }),
        Space(10),
      ]
    })
  });
}

function Footer() {
  return Container({
    height: 60,
    borderTop: "1px solid theme.border",
    borderBottom: "1px solid theme.border",
  });
}

function Pagination() {
  return Container({
    height: 60,
    borderBottom: "1px solid theme.border",
  });
}

const fields = [
  {
    title: "Name",
    width: 250
  },
  {
    title: "Email",
    width: 250
  },
  {
    title: "Phone",
    width: 200
  },
  {
    title: "Address",
    width: 1000
  },
];

const dummyData = [
  {
    No: 2,
    Name: "Jane Smith",
    Email: "jane.smith@example.com jane.smith@example.com jane.smith@example.com",
    Phone: "082345678901",
    Address: "Jl. Sudirman No. 456, Bandung, Indonesia"
  },
  {
    No: 3,
    Name: "Alice Johnson",
    Email: "alice.johnson@example.com",
    Phone: "083456789012",
    Address: "Jl. Gatot Subroto No. 789, Surabaya, Indonesia"
  },
  {
    No: 4,
    Name: "Bob Brown",
    Email: "bob.brown@example.com",
    Phone: "084567890123",
    Address: "Jl. Thamrin No. 101, Medan, Indonesia"
  },
  {
    No: 5,
    Name: "Charlie Davis",
    Email: "charlie.davis@example.com",
    Phone: "085678901234",
    Address: "Jl. Diponegoro No. 202, Yogyakarta, Indonesia"
  },
  {
    No: 6,
    Name: "Eva Green",
    Email: "eva.green@example.com",
    Phone: "086789012345",
    Address: "Jl. Ahmad Yani No. 303, Semarang, Indonesia"
  },
  {
    No: 7,
    Name: "Frank White",
    Email: "frank.white@example.com",
    Phone: "087890123456",
    Address: "Jl. Pahlawan No. 404, Malang, Indonesia"
  },
  {
    No: 8,
    Name: "Grace Black",
    Email: "grace.black@example.com",
    Phone: "088901234567",
    Address: "Jl. Hayam Wuruk No. 505, Denpasar, Indonesia"
  },
  {
    No: 9,
    Name: "Henry Wilson",
    Email: "henry.wilson@example.com",
    Phone: "089012345678",
    Address: "Jl. Gajah Mada No. 606, Palembang, Indonesia"
  },
  {
    No: 10,
    Name: "Ivy Taylor",
    Email: "ivy.taylor@example.com",
    Phone: "081123456789",
    Address: "Jl. Sisingamangaraja No. 707, Makassar, Indonesia"
  },
  {
    No: 11,
    Name: "Jack Harris",
    Email: "jack.harris@example.com",
    Phone: "082234567890",
    Address: "Jl. Teuku Umar No. 808, Balikpapan, Indonesia"
  },
  {
    No: 12,
    Name: "Karen Clark",
    Email: "karen.clark@example.com",
    Phone: "083345678901",
    Address: "Jl. Imam Bonjol No. 909, Manado, Indonesia"
  },
  {
    No: 13,
    Name: "Leo Lewis",
    Email: "leo.lewis@example.com",
    Phone: "084456789012",
    Address: "Jl. Diponegoro No. 111, Padang, Indonesia"
  },
  {
    No: 14,
    Name: "Mia Walker",
    Email: "mia.walker@example.com",
    Phone: "085567890123",
    Address: "Jl. Sudirman No. 222, Pekanbaru, Indonesia"
  },
  {
    No: 15,
    Name: "Nina Hall",
    Email: "nina.hall@example.com",
    Phone: "086678901234",
    Address: "Jl. Merdeka No. 333, Samarinda, Indonesia"
  },
  {
    No: 16,
    Name: "Oscar Young",
    Email: "oscar.young@example.com",
    Phone: "087789012345",
    Address: "Jl. Ahmad Yani No. 444, Banjarmasin, Indonesia"
  },
  {
    No: 17,
    Name: "Paul Allen",
    Email: "paul.allen@example.com",
    Phone: "088890123456",
    Address: "Jl. Gatot Subroto No. 555, Pontianak, Indonesia"
  },
  {
    No: 18,
    Name: "Quincy King",
    Email: "quincy.king@example.com",
    Phone: "089901234567",
    Address: "Jl. Thamrin No. 666, Jayapura, Indonesia"
  },
  {
    No: 19,
    Name: "Rachel Scott",
    Email: "rachel.scott@example.com",
    Phone: "081012345678",
    Address: "Jl. Pahlawan No. 777, Mataram, Indonesia"
  },
  {
    No: 20,
    Name: "Steve Adams",
    Email: "steve.adams@example.com",
    Phone: "082123456789",
    Address: "Jl. Hayam Wuruk No. 888, Kupang, Indonesia"
  }
].slice(0, 1);

function Header(ref: any, refBody: any, stateCheck: any) {
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    let check = (Object.values(stateCheck).map((x: any) => x.refc) as boolean[]).includes(false) ? false : true;
    let checkInderminate = Object.values(stateCheck).some((x: any) => x.refc) && Object.values(stateCheck).some((x: any) => !x.refc) ? true : false;
    setIndeterminate(checkInderminate)
    setCheckAll(check);
  }, [stateCheck]);

  return Container({
    height: 60,
    borderBottom: "1px solid theme.border",
    display: "flex",
    backgroundColor: "theme.backgroundPaper",
    child: Rows({
      children: [
        Container({
          width: 60,
          borderRight: "1px solid theme.border",
          child: Center({
            child: Checkbox({
              checked: checkAll,
              indeterminate,
              onClick: (e: any) => {
                const checked = e.target.checked;
                for (let key in stateCheck) {
                  const element = stateCheck[key];
                  element.setRefc(checked);
                }
              }
            })
          })
        }),
        Container({
          width: 60,
          borderRight: "1px solid theme.border",
          child: Center({
            child: Text("No", { size: 14, weight: "bold" })
          })
        }),
        Expanded({
          child: SingleChildScrollView({
            ref,
            direction: "horizontal",
            onScroll: (e: any) => {
              for (let key in refBody) {
                const element = refBody[key];
                element.current.scrollLeft = e.target.scrollLeft
              }
            },
            child: Rows({
              width: fields.reduce((acc, field) => acc + field.width, 0),
              children: fields.map((field) => {
                return Container({
                  width: field.width, borderRight: "1px solid theme.border",
                  child: Center({
                    child: Text(field.title, { size: 14, weight: "bold" })
                  })
                });
              })
            })
          })
        })
      ]
    })
  });
}

function Body(ref: any, refBody: any, stateCheck: any) {
  const [select, setSelect] = useState(-1);
  
  return Expanded({
    child: SingleChildScrollView({
      child: Column({
        children: dummyData.map((data: any, index) => {
          const refRows = useRef(null);
          refBody["row" + index] = refRows;
          const [refc, setRefc] = useState<boolean>(true);
          stateCheck["check" + index] = { refc, setRefc };
          const [isHover, setHover] = useState(false);
          return Rows({
            color: select == index ? "theme.active" : (isHover ? "theme.hover" : "theme.background"),
            onMouseEnter: () => setHover(true),
            onMouseLeave: () => setHover(false),
            onClick: () => {
              setSelect(index);
              setRefc(!refc);
            },
            children: [
              Container({
                width: 60,
                height: 50,
                borderRight: "1px solid theme.border",
                borderBottom: "1px solid theme.border",
                child: Center({
                  child: Checkbox({
                    checked: refc,
                    onClick: (e: any) => {
                      const checked = e.target.checked;
                      setRefc(checked);
                    }
                  })
                })
              }),
              Container({
                width: 60,
                height: 50,
                borderRight: "1px solid theme.border",
                borderBottom: "1px solid theme.border",
                child: Center({
                  child: Text(`${index + 1}`, { size: 14 })
                })
              }),
              Expanded({
                child: SingleChildScrollView({
                  ref: refBody["row" + index],
                  onScroll: (e: any) => ref.current.scrollLeft = e.target.scrollLeft,
                  child: Rows({
                    width: fields.reduce((acc, field) => acc + field.width, 0),
                    height: 50, borderBottom: "1px solid theme.border",
                    children: fields.map((field) => {
                      return Container({
                        width: field.width, borderRight: "1px solid theme.border",
                        child: Center({
                          boxSizing: "border-box",
                          justifyContent: field.title == "No" ? "center" : "start",
                          child: Container({
                            child: Text(data[field.title], {
                              paddingLeft: 10,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "inline-block",
                              width: field.width - 20,
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            ]
          })
        })
      })
    })
  });
}