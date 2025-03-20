<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ReturnList.aspx.vb" Inherits="DsttsBoard_ReturnList" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>반품리스트</title>
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
        #chk1,
        #chk2,
        #chk3{
            font-size: 15px;
            width: 16px;
            height: 16px;
            margin: 0;
            margin-right: 5px;
            vertical-align: bottom;
            cursor: pointer;
        }
        #chk1 + label,
        #chk2 + label,
        #chk3 + label{
            font-size: 15px;
            vertical-align: bottom;
            line-height: 16px;
            margin-right: 9px;
            cursor: pointer;
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

            #cmdSearch:hover {
                background-color: #598CBD;
                color: #fff;
            }
        input[type="text"]{
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
            <asp:ScriptManager ID="ScriptManager1" runat="server">
            </asp:ScriptManager>
            <table style=" table-layout: fixed; border-collapse: collapse;">
                <tr>
                    <td align="left" style="width: 100%; height: 17px; padding-top: 20px;">
                        <asp:Label ID="LabTitle" runat="server" Style="font-weight: 500; font-size: 22px; padding-left: 10px;">반품리스트</asp:Label>
                    </td>
                </tr>
                <tr style="height: 12px;"></tr>
                <tr>
                    <td align="center" style="width: 100%; height: 17px; padding: 10px 0; background-color: #f3f3f3; border-top: 1px solid #9d9d9d; border-bottom: 1px solid #9d9d9d;">
                        <table style="font-size: 15px; width: 100%; height: 28px">
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">날 &nbsp; &nbsp; &nbsp; &nbsp; 짜</td>
                                <td style="padding-left: 10px; vertical-align: middle; text-align: left;">
                                    <asp:TextBox ID="txtDate" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                    <span style="display: inline-block; text-align: center; width: 20px; font-size: 16px; line-height: 11px;">~</span>
                                    <asp:TextBox ID="txtDate2" runat="server" TextMode="Date" BorderWidth="1px" Style="box-sizing: border-box; width: 186px; text-align: center"></asp:TextBox>
                                    <div style="display: inline-block; margin-left: 20px;">
                                        <asp:CheckBox ID="chk1" runat="server" Text="승인" />
                                        <asp:CheckBox ID="chk2" runat="server" Text="미처리" />
                                        <asp:CheckBox ID="chk3" runat="server" Text="완료" />
                                    </div>
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">구매담당자</td>
                                <td style="padding-left: 10px; vertical-align: middle; width: 400px; text-align: left;">
                                    <asp:TextBox ID="txtUser" runat="server" Style="font-size: 14px; padding-left: 10px; width: 400px; margin-top: 3px;"></asp:TextBox>
                                </td>
                            </tr>
                            <tr style="height: 38px;">
                                <td style="font-weight: 400; vertical-align: middle; width: 100px; text-align: center; font-size: 15px;">제 &nbsp; &nbsp; &nbsp; &nbsp; 목</td>
                                <td style="padding-left: 10px; vertical-align: middle; width: 400px; text-align: left;">
                                    <asp:TextBox ID="txtTitle" runat="server" Style="font-size: 14px; padding-left: 10px; width: 400px; margin-top: 3px;"></asp:TextBox>
                                    <%--<asp:ImageButton ID="cmdSearch" runat="server" ImageUrl="~/images/button/btn_search.gif" />--%>
                                    <asp:Button ID="cmdSearch" runat="server" Text="검색"/>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="height: 28px;"></tr>
                <tr >
                    <td style="width: 100%" valign="top">
                        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
                            <ContentTemplate>
                                <asp:DataGrid ID="fpsList" runat="server" AllowPaging="True" AutoGenerateColumns="False"
                                    CellPadding="1" Font-Bold="False" Font-Italic="False"
                                    Font-Overline="False" Font-Strikeout="False"
                                    Font-Underline="False" ForeColor="#333333" style="border:0;"
                                    Width="100%">
                                    <SelectedItemStyle BackColor="#598CBD" Font-Bold="False" Font-Italic="False" Font-Overline="False"
                                        Font-Strikeout="False" Font-Underline="True" ForeColor="#ffffff" />
                                    <PagerStyle BackColor="#f3f3f3" ForeColor="#555555" HorizontalAlign="Center" Mode="NumericPages" Height="32px" />
                                    <Columns>
                                        <asp:BoundColumn DataField="seqno" HeaderText="seqno" Visible="False"></asp:BoundColumn>
                                        <asp:TemplateColumn HeaderText="작성자">
                                            <EditItemTemplate>
                                                <asp:TextBox runat="server"></asp:TextBox>
                                            </EditItemTemplate>
                                            <ItemTemplate>
                                                <table style="width: 100%">
                                                    <tr>
                                                        <td align="center">
                                                            <asp:Label ID="labUserName" runat="server" Text="Label"></asp:Label></td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <asp:ImageButton ID="cmdDelete" runat="server" CommandName="btnDelete" ImageUrl="~/DsttsBoard/Image/btn_delete.gif"
                                                                Visible="False" /></td>
                                                    </tr>
                                                </table>
                                            </ItemTemplate>
                                        </asp:TemplateColumn>
                                        <asp:BoundColumn HeaderText="전표번호">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Center" />
                                        </asp:BoundColumn>
                                        <asp:BoundColumn HeaderText="업체코드(명)"></asp:BoundColumn>
                                        <asp:BoundColumn HeaderText="상품명,규격,재질"></asp:BoundColumn>
                                        <asp:BoundColumn HeaderText="메이커"></asp:BoundColumn>
                                        <asp:BoundColumn HeaderText="수량,유형">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Right" />
                                        </asp:BoundColumn>
                                        <asp:BoundColumn HeaderText="상품유형">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Left" />
                                        </asp:BoundColumn>
                                        <asp:TemplateColumn HeaderText="검수">
                                            <EditItemTemplate>
                                                <asp:TextBox runat="server"></asp:TextBox>
                                            </EditItemTemplate>
                                            <ItemTemplate>
                                                <table style="width: 100%">
                                                    <tr>
                                                        <td>1차</td>
                                                        <td><asp:Label ID="labStatus1" runat="server"></asp:Label></td>
                                                    </tr>
                                                    <tr>
                                                        <td>2차</td>
                                                        <td><asp:Label ID="labStatus2" runat="server"></asp:Label></td>
                                                    </tr>
                                                    <tr>
                                                        <td>3차</td>
                                                        <td><asp:Label ID="labStatus3" runat="server"></asp:Label></td>
                                                    </tr>
                                                </table>
                                            </ItemTemplate>
                                        </asp:TemplateColumn>
                                        <asp:BoundColumn HeaderText="반품전표">
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Center" />
                                        </asp:BoundColumn>
                                        <asp:TemplateColumn HeaderText="상세">
                                            <EditItemTemplate>
                                                &nbsp;
                                            </EditItemTemplate>
                                            <ItemTemplate>
                                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%">
                                                    <tr>
                                                        <td align="right">
                                                            <asp:ImageButton ID="imgDetail" runat="server" ImageUrl="~/DsttsBoard/Image/btn_contents(1).gif" CommandName="DetailComment" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="right">
                                                            <asp:ImageButton ID="imgOK" runat="server" CommandName="DetailOK" ImageUrl="~/DsttsBoard/Image/btn_accept(1).gif" />
                                                            <asp:ImageButton ID="imgCancel" runat="server" CommandName="DetailCancel" ImageUrl="~/DsttsBoard/Image/btn_return(3).gif" />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </ItemTemplate>
                                            <ItemStyle Font-Bold="False" Font-Italic="False" Font-Overline="False" Font-Strikeout="False"
                                                Font-Underline="False" HorizontalAlign="Center" />
                                        </asp:TemplateColumn>
                                    </Columns>
                                    <HeaderStyle Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Center" CssClass="table_header"/>
                                </asp:DataGrid>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="width: 100%">
                        <asp:UpdatePanel ID="UpdatePanel2" runat="server">
                            <ContentTemplate>
                                <asp:DataList ID="DataList1" runat="server"
                                    CellPadding="4" Font-Bold="False" Font-Italic="False" Font-Overline="False"
                                    Font-Strikeout="False" Font-Underline="False" ForeColor="#333333" GridLines="Both"
                                    Style="width: 100%;" Width="100%">
                                    <AlternatingItemStyle BackColor="White" />
                                    <SelectedItemStyle BackColor="#598CBD" Font-Bold="True" ForeColor="#ffffff" />
                                    <HeaderTemplate>
                                        첨부의견
                                    </HeaderTemplate>
                                    <HeaderStyle Font-Overline="False" Font-Strikeout="False" Font-Underline="False" HorizontalAlign="Left" CssClass="table_header" />
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
                        <asp:Label ID="Label11" runat="server" style="display:block; line-height: 28px; text-align:start; height: 28px; font-weight:400; padding-left:10px; background-color: #598CBD; color: #fff; margin-top: 20px; border-color: #c8c8c8;"
                            Text="첨부의견"></asp:Label>
                        <asp:TextBox ID="txtComment" runat="server" Height="80px" style="font-size: 15px; box-sizing:border-box; resize: vertical; border-color: #b3b3b3;" TextMode="MultiLine" Width="100%"></asp:TextBox>
                        <asp:ImageButton ID="cmdComWrite" runat="server" ImageUrl="~/DsttsBoard/Image/btn_write.gif" style="margin-top: 5px;"/>
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
