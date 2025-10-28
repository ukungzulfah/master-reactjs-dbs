import { useRef, useState, useEffect } from "react";
import { Center, Click, Column, Container, Expanded, Icon, Positioned, Row, Space, Stack, Text, Widget } from "./Widgets";
import moment from 'moment';
moment.locale('id');

export default function InputDateRange(props: any) {
  const refRow = useRef<HTMLDivElement>(null);
  const refPositioned = useRef<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const popupWidth = 600;
  const [leftArrow, setLeftArrow] = useState(0);
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [hoverDate, setHoverDate] = useState<Date | undefined>();
  const nextMonthView = moment(currentMonthView).add(1, "month").toDate();
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  useEffect(() => {
    if (isPopupVisible && refRow.current) {
      const rowRect = refRow.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      let calculatedLeft = rowRect.left;
      if (calculatedLeft + popupWidth > windowWidth - 10) { 
        calculatedLeft = windowWidth - popupWidth - 10;
      }
      if (calculatedLeft < 10) {
        calculatedLeft = 10;
      }
      const arrowOffset = ((rowRect.width - 20) / 2); 
      setLeftArrow(rowRect.left - calculatedLeft + arrowOffset);
      setPopupStyle({
        position: "fixed", 
        top: `${rowRect.bottom + 5}px`, 
        left: `${calculatedLeft}px`,
        zIndex: 1000,
      });
    }
  }, [isPopupVisible, popupWidth]); 

  const handleDateSelect = (selectedDate: Date) => {
    if (!startDate || endDate) {
      setStartDate(selectedDate);
      setEndDate(undefined); 
      setHoverDate(undefined); 
    }
    else if (startDate && !endDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
        setHoverDate(undefined); 
      } else {
        setStartDate(selectedDate);
        setEndDate(undefined); 
        setHoverDate(undefined); 
      }
    }
  };

  const handleDateHover = (hoveredDate: Date) => {
    if (startDate && !endDate) {
      setHoverDate(hoveredDate);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonthView(moment(currentMonthView).subtract(1, "month").toDate());
  };

  const goToNextMonth = () => {
    setCurrentMonthView(moment(currentMonthView).add(1, "month").toDate());
  };

  useEffect(() => {
    if(typeof props.onChange == 'function') {
      props.onChange([startDate, endDate]);
    }
    if(startDate && endDate) {
      setIsPopupVisible(false);
    }
  }, [endDate]);

  const mainContainer = () => Container({
    width: 300, 
    height: 40,
    radius: 10,
    border: "1px solid #ccc", 
    cursor: "pointer", 
    onClick: togglePopup, 
    child: Row({
      ref: refRow,
      center: true, 
      children: [
        Space(15),
        Icon("calendar_month", { size: 20, color: "#555" }), 
        Space(10),
        Expanded({
          child: Text(startDate ? moment(startDate).format("D MMM YYYY") : "Start Date", { color: startDate ? "#000" : "#888" })  
        }),
        Space(10),
        Icon("arrow_forward", { size: 20, color: "#555" }), 
        Space(10),
        Expanded({
          child: Text(endDate ? moment(endDate).format("D MMM YYYY") : "End Date", { color: endDate ? "#000" : "#888" }) 
        }),
        Space(15),
        isPopupVisible && Positioned({
          ref: refPositioned,
          ...popupStyle,
          child: Container({
            width: popupWidth,
            child: Stack({ 
              children: [
                Positioned({
                  top: 0, 
                  left: leftArrow, 
                  child: Container({
                    width: 0,
                    height: 0,
                    borderBottom: "15px solid white", 
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    style: { filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.05))' }
                  })
                }),
                Positioned({
                  width: "100%",
                  marginTop: 14, 
                  child: Container({
                    color: "white", 
                    boxShadow: "0 5px 15px rgba(0,0,0,0.15)", 
                    radius: 10,
                    overflow: "hidden", 
                    border: "1px solid #eee", 
                    child: Column({
                      children: [
                        Container({
                          height: 50, 
                          child: Row({
                            center: true,
                            children: [
                              Space(10),
                              Click({
                                click: goToPreviousMonth,
                                child: Container({
                                  padding: 8, radius: 50, 
                                  child: Icon('arrow_back_ios_new', { size: 18 })
                                })  
                              }),
                              Expanded({
                                child: Center({
                                  child: Text(moment(currentMonthView).format("MMMM YYYY"), { weight: "bold", size: 15 })  
                                })
                              }),
                              Space(10), 
                              Expanded({
                                child: Center({
                                  child: Text(moment(nextMonthView).format("MMMM YYYY"), { weight: "bold", size: 15 })
                                })
                              }),
                              Click({
                                click: goToNextMonth,
                                child: Container({
                                  padding: 8, radius: 50, 
                                  child: Icon('arrow_forward_ios', { size: 18 })
                                })
                              }),
                              Space(10),
                            ]
                          })
                        }),
                        Expanded({
                          child: Row({
                            children: [
                              Expanded({
                                child: ContainerDate({
                                  displayDate: currentMonthView, 
                                  startDate: startDate,
                                  endDate: endDate,  
                                  hoverDate: hoverDate,
                                  onSelect: handleDateSelect, 
                                  onHover: handleDateHover, 
                                })
                              }),
                              Space(15), 
                              Expanded({
                                child: ContainerDate({
                                  displayDate: nextMonthView, 
                                  startDate: startDate,
                                  endDate: endDate, 
                                  hoverDate: hoverDate,
                                  onSelect: handleDateSelect, 
                                  onHover: handleDateHover,
                                })
                              }),
                            ]
                          })
                        }),
                      ]
                    })
                  })
                })
              ]
            })
          })
        })
      ].filter(Boolean) 
    })
  }).builder(); 

  return Widget(mainContainer); 
}

interface ContainerDateProps {
  displayDate: Date; 
  startDate?: Date;
  endDate?: Date; 
  hoverDate?: Date;
  onSelect?: (date: Date) => void;
  onHover?: (date: Date) => void;
}

export function ContainerDate({
  displayDate,
  startDate,
  endDate,
  hoverDate,
  onSelect,
  onHover,
}: ContainerDateProps) {
  const hariHeader = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const today = new Date(); 
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  const normalizeDate = (date: Date): number => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate.getTime();
  }
  const normStartDate = startDate ? normalizeDate(startDate) : undefined;
  const normEndDate = endDate ? normalizeDate(endDate) : undefined;
  const normHoverDate = hoverDate ? normalizeDate(hoverDate) : undefined;
  const normToday = normalizeDate(today);


  return Container({
    child: Column({
      children: [
        Row({
          children: hariHeader.map((h) =>
            Container({
              width: 40, 
              height: 30, 
              child: Center({ child: Text(h, { size: 11, weight: "bold", color: "#666" }) }), 
            })
          ),
        }),
        ...weeks.map((week, wIdx) =>
          Row({
            key: `week-${wIdx}`, 
            children: week.map((cellDate, dIdx) => {
              if (!cellDate) {
                return Container({ key: `empty-${wIdx}-${dIdx}`, width: 40, height: 40 });
              }
              const normCellDate = normalizeDate(cellDate); 
              const isToday = normCellDate === normToday;
              const isSelectedStart = normStartDate === normCellDate;
              const isSelectedEnd = normEndDate === normCellDate;
              let isInRange = false;
              let isHoveringRange = false; 
              if (normStartDate && normEndDate) { 
                isInRange = normCellDate > normStartDate && normCellDate < normEndDate;
              } else if (normStartDate && normHoverDate) { 
                  const start = Math.min(normStartDate, normHoverDate);
                  const end = Math.max(normStartDate, normHoverDate);
                  isInRange = normCellDate > start && normCellDate < end;
                  isHoveringRange = isInRange || normCellDate === normHoverDate; 
              }
              let bgColor = "transparent";
              let textColor = "#333"; 
              let borderRadius = "0px";
              let fontWeight = "normal";
              if (isSelectedStart || isSelectedEnd) {
                bgColor = "#2a9d8f"; 
                textColor = "white";
                fontWeight = "bold";
                if (isSelectedStart && !isSelectedEnd) borderRadius = "50% 0 0 50%"; 
                if (!isSelectedStart && isSelectedEnd) borderRadius = "0 50% 50% 0"; 
                if (isSelectedStart && isSelectedEnd) borderRadius = "50%"; 
              } else if (isInRange) {
                 bgColor = isHoveringRange ? "#e9f5f3" : "#d2ebe8"; 
                 if (isHoveringRange) {
                     if (normHoverDate && normStartDate) {
                        if (normHoverDate > normStartDate && normCellDate === normHoverDate) borderRadius = "0 50% 50% 0";
                        if (normHoverDate < normStartDate && normCellDate === normHoverDate) borderRadius = "50% 0 0 50%";
                     }
                 } else { 
                     if (normStartDate && normCellDate === normStartDate + 86400000) borderRadius = "0"; 
                     if (normEndDate && normCellDate === normEndDate - 86400000) borderRadius = "0"; 
                 }
              } else if (isToday) {
                textColor = "#2a9d8f";
                fontWeight = "bold";
              }

              return Container({
                key: `day-${cellDate.toISOString()}`,
                width: 40,
                height: 40,
                radius: borderRadius,
                backgroundColor: bgColor,
                style: { cursor: onSelect ? "pointer" : "default" },
                onClick: () => onSelect?.(cellDate),
                onMouseEnter: () => onHover?.(cellDate),
                child: Center({
                  child: Text(String(cellDate.getDate()), {
                     size: 12,
                     color: textColor,
                     weight: fontWeight
                  }),
                }),
              });
            })
          })
        )
      ]
    })
  }).builder();
}