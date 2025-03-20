<%@ Page Language="VB" AutoEventWireup="false" CodeFile="MeetProcess.aspx.vb" Inherits="DsttsBoard_MeetProcess" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>회의결과 진행현황</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');

        * {
            font-family: "Noto Sans KR", serif;
        }

        a:visited,
        a:link {
            text-decoration: underline;
            text-decoration-color: red;
            color: black;
        }

        a:active {
            text-decoration: none;
            color: black;
        }

        a:hover {
            text-decoration: none;
            color: dodgerblue;
        }

        font:hover {
            color: dodgerblue;
        }

        select, input[type="text"], input[type="date"] {
            font-family: "Noto Sans KR", serif;
            height: 28px;
            border: 1px solid #aaa;
            border-radius: 3px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            box-sizing: border-box;
        }

        input[type="date"] {
            margin-top: 3px;
        }

        td {
            font-size: 14px;
            padding: 0;
            border: 0;
        }

        input[type="radio"] {
            display: none;
        }

            input[type="radio"] + label {
                cursor: pointer;
                color: #666;
            }

            input[type="radio"]:checked + label {
                position: relative;
                color: #598CBD;
            }

                input[type="radio"]:checked + label::after {
                    display: block;
                    content: "";
                    width: 60px;
                    height: 3px;
                    background-color: #598CBD;
                    position: absolute;
                    bottom: -9px;
                    left: 50%;
                    transform: translateX(-50%);
                }

        .table_header {
            height: 48px;
            border-top: 1px solid #cecece;
            border-bottom: 2px solid #598CBD;
        }

        .icon_plus {
            display: inline-block;
            position: relative;
            width: 14px;
            height: 14px;
            vertical-align: middle;
        }

            .icon_plus:before {
                display: block;
                content: "가로 선입니다.";
                font-size: 0;
                width: 14px;
                height: 2px;
                background-color: #598CBD;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .icon_plus::after {
                display: block;
                content: "세로 선입니다.";
                font-size: 0;
                width: 2px;
                height: 14px;
                background-color: #598CBD;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

        .btnPlus:hover .icon_plus::before,
        .btnPlus:hover .icon_plus::after {
            background-color: #fff;
        }

        #cmdSearch {
            width: 80px;
            height: 28px;
            background-color: #fff;
            border: 1px solid #598CBD;
            color: #598CBD;
            border-radius: 3px;
            padding: 10px;
            line-height: 0px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            vertical-align: bottom;
            margin-left: 20px;
        }

            .btnPlus:hover,
            .btnPlus:hover span,
            #cmdSearch:hover {
                background-color: #598CBD;
                color: #fff;
            }

        input[type="text"] {
            cursor: text;
        }

        .wrapper > table {
            width: calc(100vw - 200px);
            max-width: 1280px;
            min-width: 1000px;
        }

        #fpsList td {
            text-align: center;
        }

        #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
            border-bottom: 1px solid #eee;
            height: 40px;
        }

        @media screen and (min-width: 1200px) {
            td {
                font-size: 15px;
            }

            #fpsList > tbody > tr:not(:first-of-type):not(:last-of-type) {
                border-bottom: 1px solid #eee;
                height: 50px;
            }
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="wrapper">
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
            <table style="table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td align="left" style="width: 100%; height: 17px; padding-top: 20px;">
                        <asp:Label ID="LabTitle" runat="server" Style="font-weight: 500; font-size: 22px; padding-left: 10px;">회의결과 진행현황</asp:Label>
                    </td>
                </tr>
                <tr style="height: 12px;"></tr>
                <tr>
                    <td align="center" style="width: 100%; height: 17px; padding: 10px 0; background-color: #f3f3f3; border-top: 1px solid #9d9d9d; border-bottom: 1px solid #9d9d9d;">
                        <table style="font-size: 15px; width: 100%; height: 28px">
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">날 &nbsp; &nbsp; &nbsp; 짜</td>
                                <td style="padding-left: 10px; vertical-align: middle; text-align: left;">
                                    <asp:TextBox ID="txtDate" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                    <span style="display: inline-block; text-align: center; width: 20px; font-size: 16px; line-height: 11px;">~</span>
                                    <asp:TextBox ID="txtDate2" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">제 &nbsp; &nbsp; &nbsp; 목</td>
                                <td style="padding-left: 10px; vertical-align: middle; width: 400px; text-align: left;">
                                    <asp:TextBox ID="txtTitle" runat="server" BorderWidth="1px" Width="400px"></asp:TextBox>
                                    <%--<asp:ImageButton ID="cmdSearch" runat="server" ImageUrl="~/images/button/btn_search.gif" />--%>
                                    <asp:Button ID="cmdSearch" runat="server" Text="검색" />
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
                <tr style="height: 18px;"></tr>
                <tr style="height: 33px;">
                    <td style="padding: 0 10px; display: flex; justify-content: space-between;">
                        <asp:RadioButtonList ID="rdoSelect" runat="server" RepeatDirection="Horizontal" Style="width: 170px; text-align: center;">
                            <asp:ListItem Selected="True" Value="3">전체</asp:ListItem>
                            <asp:ListItem Value="0">미완료</asp:ListItem>
                            <asp:ListItem Value="1">완료</asp:ListItem>
                        </asp:RadioButtonList>
                        <a class="btnPlus" href='#' onclick="window.open('board/MeetWrite.aspx','small','height=420,width=850,scrollbars=yes,top=0,left=0'); return false;" style="display: inline-block; padding: 0px 8px; border: 1px solid #598CBD; color: #598CBD; text-decoration: none; border-radius: 3px; padding-bottom: 6px; margin-bottom: 8px;">
                            <i class="icon_plus"></i>
                            <span style="vertical-align: middle; line-height: 15px;">추가하기</span>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%" valign="top">
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False"
                                    CellPadding="3" Font-Bold="False" Font-Italic="False" Font-Overline="False"
                                    Font-Strikeout="False" Font-Underline="False" ForeColor="#333333" Style="text-align: center; text-decoration: none; border: 1px solid transparent;" Width="100%">
                                    <SelectedItemStyle BackColor="#598CBD" Font-Bold="False" Font-Italic="False" Font-Overline="False"
                                        Font-Strikeout="False" Font-Underline="True" ForeColor="#ffffff" />
                                    <PagerStyle BackColor="#F3F3F3" ForeColor="#555555" HorizontalAlign="Center" Mode="NumericPages" Height="32px" />
                                    <AlternatingItemStyle BackColor="White" />
                                    <HeaderStyle Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" CssClass="table_header" />
                                    <Columns>
                                        <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                        <asp:BoundColumn DataField="regdate" HeaderText="날짜" DataFormatString="{0:yyyy-MM-dd}">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Center" />
                                        </asp:BoundColumn>
                                        <asp:BoundColumn DataField="title" HeaderText="해당부서"></asp:BoundColumn>
                                        <asp:BoundColumn DataField="content1" HeaderText="회의내용"></asp:BoundColumn>
                                        <asp:BoundColumn DataField="cnt" DataFormatString="{0:n0}" HeaderText="댓글">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Right" />
                                        </asp:BoundColumn>
                                        <asp:TemplateColumn HeaderText="진행현황">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Center" />
                                            <ItemTemplate>
                                                <table style="width: 100%">
                                                    <tr>
                                                        <td align="right" style="width: 100%">
                                                            <asp:Label ID="labStaTus" runat="server" Font-Bold="True" ForeColor="#C00000"></asp:Label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right" style="width: 100%">
                                                            <asp:ImageButton ID="cmdDetail" runat="server" CommandName="DetailComment" ImageUrl="~/DsttsBoard/Image/btn_Detail.gif" />&nbsp;<asp:ImageButton ID="cmdOK" runat="server" CommandName="OKProgress"
                                                                ImageUrl="~/DsttsBoard/Image/Expen01.gif" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </ItemTemplate>
                                        </asp:TemplateColumn>
                                    </Columns>
                                </asp:DataGrid>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="width: 100%">
                        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                            <ContentTemplate>
                                <asp:DataList ID="DataList1" runat="server" CellPadding="4" Font-Bold="False" Font-Italic="False"
                                    Font-Overline="False" Font-Strikeout="False" Font-Underline="False"
                                    ForeColor="#333333" Width="100%" GridLines="Both">
                                    <AlternatingItemStyle BackColor="White" />
                                    <SelectedItemStyle BackColor="#598CBD" Font-Bold="True" ForeColor="#ffffff" />
                                    <HeaderTemplate>
                                        첨부의견
                                    </HeaderTemplate>
                                    <HeaderStyle BackColor="#f3f3f3" Font-Bold="True" Font-Italic="False" Font-Overline="False"
                                        Font-Strikeout="False" Font-Underline="False" ForeColor="#000000" HorizontalAlign="Left" />
                                    <ItemTemplate>
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                            <tr>
                                                <td style="font-weight: bold; width: 5%; height: 12px">
                                                    <%#DataBinder.Eval(Container.DataItem, "UserName")%>
                                                </td>
                                                <td style="vertical-align: middle; width: 20%; height: 12px; text-align: center">
                                                    <%#DataBinder.Eval(Container.DataItem, "entrydate")%>
                                                </td>
                                                <td style="vertical-align: middle; width: 75%; height: 12px; text-align: left">
                                                    <%#DataBinder.Eval(Container.DataItem, "memo")%>
                                                </td>
                                            </tr>
                                        </table>
                                    </ItemTemplate>
                                </asp:DataList>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </td>
                </tr>
                <tr>
                    <td align="right" style="width: 100%">
                        <asp:Label ID="Label11" runat="server" Style="display: block; text-align: start; height: 28px; line-height: 28px; font-weight: 400; padding-left: 10px; background-color: #598CBD; color: #fff; margin-top: 20px; border-color: #c8c8c8;"
                            Text="첨부의견"></asp:Label>
                        <asp:TextBox ID="txtComment" runat="server" Height="80px" Style="font-size: 15px; box-sizing: border-box; resize: vertical; border-color: #b3b3b3;" TextMode="MultiLine" Width="100%"></asp:TextBox>
                        <asp:ImageButton ID="cmdComWrite" runat="server" ImageUrl="~/DsttsBoard/Image/btn_write.gif" Style="margin-top: 5px;" />
                    </td>
                </tr>
            </table>

        </div>

        <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" Format="yyyy-MM-dd"
            PopupButtonID="cmdCal" TargetControlID="txtDate"></ajaxToolkit:CalendarExtender>
        <ajaxToolkit:CalendarExtender ID="calendarButtonExtender2" runat="server" Format="yyyy-MM-dd"
            PopupButtonID="cmdCal2" TargetControlID="txtDate2"></ajaxToolkit:CalendarExtender>


    </form>
</body>
</html>
